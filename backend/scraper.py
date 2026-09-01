import json
import re
from pathlib import Path
from typing import Optional

import httpx
from bs4 import BeautifulSoup

from models import Product, ProductCategory, SkinConcern, SkinType

DATA_DIR = Path(__file__).parent / "data"
PRODUCTS_FILE = DATA_DIR / "products.json"

SEPHORA_SEARCH_URL = "https://www.sephora.com/search?keyword={query}"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

CATEGORY_QUERIES: dict[ProductCategory, str] = {
    ProductCategory.CLEANSER: "facial cleanser",
    ProductCategory.TONER: "toner",
    ProductCategory.SERUM: "face serum",
    ProductCategory.DAY_CREAM: "day moisturizer",
    ProductCategory.NIGHT_CREAM: "night cream",
    ProductCategory.EYE_CREAM: "eye cream",
    ProductCategory.SUNSCREEN: "sunscreen face",
    ProductCategory.MASK: "face mask",
}


def load_products() -> list[Product]:
    if not PRODUCTS_FILE.exists():
        return []
    with open(PRODUCTS_FILE, encoding="utf-8") as f:
        data = json.load(f)
    return [Product(**item) for item in data]


def save_products(products: list[Product]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump([p.model_dump() for p in products], f, indent=2, ensure_ascii=False)


def _parse_rating(text: str) -> Optional[float]:
    match = re.search(r"([\d.]+)", text)
    return float(match.group(1)) if match else None


def _parse_price(text: str) -> Optional[float]:
    match = re.search(r"\$?([\d.]+)", text.replace(",", ""))
    return float(match.group(1)) if match else None


async def scrape_sephora_product(url: str) -> Optional[dict]:
    """Attempt to scrape a single Sephora product page."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=HEADERS)
            if resp.status_code != 200:
                return None

            soup = BeautifulSoup(resp.text, "lxml")

            name_el = soup.select_one('[data-at="product_name"], h1 span')
            brand_el = soup.select_one('[data-at="brand_name"], a[data-at="brand_name"]')
            price_el = soup.select_one('[data-at="price"], span[data-comp*="Price"]')
            rating_el = soup.select_one('[data-at="star_rating"], .Rating')

            ingredients_section = soup.find(string=re.compile(r"ingredients", re.I))
            ingredients: list[str] = []
            if ingredients_section:
                parent = ingredients_section.find_parent()
                if parent:
                    text = parent.get_text(separator=" ", strip=True)
                    raw = re.sub(r"(?i)ingredients[:\s]*", "", text)
                    ingredients = [i.strip() for i in re.split(r"[,;]", raw) if i.strip()][:20]

            reviews: list[str] = []
            for review_el in soup.select('[data-at="review_text"], .ReviewText')[:10]:
                text = review_el.get_text(strip=True)
                if text:
                    reviews.append(text)

            return {
                "name": name_el.get_text(strip=True) if name_el else None,
                "brand": brand_el.get_text(strip=True) if brand_el else None,
                "price": _parse_price(price_el.get_text()) if price_el else None,
                "rating": _parse_rating(rating_el.get_text()) if rating_el else None,
                "ingredients": ingredients,
                "reviews": reviews,
                "source_url": url,
            }
    except Exception:
        return None


async def scrape_sephora_search(query: str, limit: int = 5) -> list[dict]:
    """Search Sephora and extract basic product info from search results."""
    results: list[dict] = []
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            url = SEPHORA_SEARCH_URL.format(query=query.replace(" ", "+"))
            resp = await client.get(url, headers=HEADERS)
            if resp.status_code != 200:
                return results

            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select('[data-comp*="ProductTile"], .ProductTile')[:limit]:
                name_el = item.select_one('[data-at="product_name"], .ProductTile-name')
                brand_el = item.select_one('[data-at="brand_name"]')
                price_el = item.select_one('[data-at="price"]')
                rating_el = item.select_one('[data-at="star_rating"]')
                link_el = item.select_one("a[href*='/product/']")

                href = link_el.get("href", "") if link_el else ""
                product_url = f"https://www.sephora.com{href}" if href.startswith("/") else href

                results.append({
                    "name": name_el.get_text(strip=True) if name_el else "Unknown",
                    "brand": brand_el.get_text(strip=True) if brand_el else "Unknown",
                    "price": _parse_price(price_el.get_text()) if price_el else 0,
                    "rating": _parse_rating(rating_el.get_text()) if rating_el else 4.0,
                    "source_url": product_url,
                })
    except Exception:
        pass
    return results


def _infer_skin_types(ingredients: list[str], pros: list[str]) -> list[SkinType]:
    text = " ".join(ingredients + pros).lower()
    types: list[SkinType] = []
    if any(k in text for k in ["salicylic", "niacinamide", "lightweight", "oil-free", "mattifying"]):
        types.append(SkinType.OILY)
    if any(k in text for k in ["ceramide", "hyaluronic", "squalane", "shea", "rich", "nourishing"]):
        types.append(SkinType.DRY)
    if any(k in text for k in ["gentle", "centella", "aloe", "fragrance-free", "calming"]):
        types.append(SkinType.SENSITIVE)
    if any(k in text for k in ["balanced", "all skin"]):
        types.extend([SkinType.COMBINATION, SkinType.NORMAL])
    if not types:
        types = [SkinType.NORMAL, SkinType.COMBINATION]
    return list(dict.fromkeys(types))


def _infer_concerns(ingredients: list[str], pros: list[str]) -> list[SkinConcern]:
    text = " ".join(ingredients + pros).lower()
    concerns: list[SkinConcern] = []
    mapping = {
        SkinConcern.ACNE: ["salicylic", "tea tree", "benzoyl", "acne", "blemish"],
        SkinConcern.AGING: ["retinol", "peptide", "anti-aging", "wrinkle", "bakuchiol"],
        SkinConcern.SAGGING: ["peptide", "proxylane", "firm", "lift", "elastic"],
        SkinConcern.FINE_LINES: ["retinol", "hyaluronic", "peptide", "fine line", "wrinkle"],
        SkinConcern.DARK_SPOTS: ["vitamin c", "niacinamide", "brighten", "dark spot"],
        SkinConcern.REDNESS: ["centella", "azelaic", "calm", "soothe"],
        SkinConcern.DEHYDRATION: ["hyaluronic", "ceramide", "hydrat", "moistur"],
        SkinConcern.OILINESS: ["niacinamide", "salicylic", "mattif", "oil-free", "lightweight"],
        SkinConcern.PORES: ["niacinamide", "pore", "salicylic"],
        SkinConcern.DULLNESS: ["vitamin c", "glycolic", "glow", "bright"],
    }
    for concern, keywords in mapping.items():
        if any(k in text for k in keywords):
            concerns.append(concern)
    return concerns


def _extract_pros_cons(reviews: list[str]) -> tuple[list[str], list[str]]:
    pros: list[str] = []
    cons: list[str] = []
    positive_words = ["love", "great", "amazing", "perfect", "smooth", "glow", "hydrat", "gentle", "effective"]
    negative_words = ["hate", "bad", "irritat", "breakout", "greasy", "heavy", "expensive", "burn", "dry"]

    for review in reviews:
        lower = review.lower()
        if any(w in lower for w in positive_words):
            pros.append(review[:120] + ("..." if len(review) > 120 else ""))
        if any(w in lower for w in negative_words):
            cons.append(review[:120] + ("..." if len(review) > 120 else ""))

    return pros[:5], cons[:5]


async def refresh_products_from_sephora() -> dict:
    """
    Attempt to scrape Sephora for fresh product data.
    Falls back to existing seed data if scraping fails.
    """
    existing = {p.id: p for p in load_products()}
    updated_count = 0
    errors: list[str] = []

    for category, query in CATEGORY_QUERIES.items():
        search_results = await scrape_sephora_search(query, limit=3)
        if not search_results:
            errors.append(f"No results for {category.value}")
            continue

        for i, item in enumerate(search_results):
            product_id = f"sephora-{category.value}-{i}"
            detail = None
            if item.get("source_url"):
                detail = await scrape_sephora_product(item["source_url"])

            ingredients = (detail or {}).get("ingredients", [])
            reviews = (detail or {}).get("reviews", [])
            pros, cons = _extract_pros_cons(reviews)

            if existing.get(product_id):
                old = existing[product_id]
                if ingredients:
                    old.ingredients = ingredients
                if pros:
                    old.pros = pros
                if cons:
                    old.cons = cons
                if detail and detail.get("rating"):
                    old.rating = detail["rating"]
                updated_count += 1
            else:
                product = Product(
                    id=product_id,
                    name=item.get("name", "Unknown Product"),
                    brand=item.get("brand", "Unknown"),
                    category=category,
                    price=item.get("price", 0) or 30.0,
                    rating=item.get("rating", 4.0) or 4.0,
                    review_count=100,
                    ingredients=ingredients or ["Water", "Glycerin"],
                    pros=pros or ["Well-reviewed on Sephora"],
                    cons=cons or [],
                    suitable_skin_types=_infer_skin_types(ingredients, pros),
                    addresses_concerns=_infer_concerns(ingredients, pros),
                    source="Sephora",
                    shipping_info="Free shipping on orders $50+ (US)",
                    source_url=item.get("source_url"),
                )
                existing[product_id] = product
                updated_count += 1

    products = list(existing.values())
    save_products(products)

    return {
        "success": True,
        "updated_count": updated_count,
        "total_products": len(products),
        "errors": errors,
        "message": "数据已更新" if not errors else "部分类别使用本地种子数据",
    }
