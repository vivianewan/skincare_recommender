import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query

from fastapi.middleware.cors import CORSMiddleware

from i18n import (
    CATEGORY_LABELS,
    CONCERN_LABELS,
    Lang,
    SKIN_TYPE_LABELS,
    normalize_lang,
)
from models import (
    Product,
    ProductCategory,
    ProductRecommendation,
    RecommendationResponse,
    SkinConcern,
    SkinType,
    UserProfile,
)
from recommender import derive_benefits, recommend_products
from scraper import load_products, refresh_products_from_sephora, save_products

DATA_DIR = Path(__file__).parent / "data"
SEED_FILE = DATA_DIR / "products_seed.json"


@asynccontextmanager
async def lifespan(app: FastAPI):
    products = load_products()
    if not products and SEED_FILE.exists():
        with open(SEED_FILE, encoding="utf-8") as f:
            seed_data = json.load(f)
        products = [Product(**item) for item in seed_data]
        save_products(products)
    app.state.products = products
    yield


app = FastAPI(
    title="Skincare Recommender API",
    description="Skincare ingredient analysis and personalized recommendations",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "products_count": len(app.state.products)}


@app.get("/api/products")
async def get_products(
    category: ProductCategory | None = None,
    lang: str = Query("zh"),
):
    products: list[Product] = app.state.products
    if category:
        products = [p for p in products if p.category == category]
    language = normalize_lang(lang)
    return [_product_with_benefits(p, language) for p in products]


@app.get("/api/products/{product_id}")
async def get_product(product_id: str, lang: str = Query("zh")):
    language = normalize_lang(lang)
    for p in app.state.products:
        if p.id == product_id:
            return _product_with_benefits(p, language)
    raise HTTPException(status_code=404, detail="Product not found")


@app.get("/api/meta")
async def get_meta(lang: str = Query("zh")):
    language = normalize_lang(lang)
    return {
        "lang": language.value,
        "skin_types": [
            {"value": s.value, "label": SKIN_TYPE_LABELS[language][s]} for s in SkinType
        ],
        "concerns": [
            {"value": c.value, "label": CONCERN_LABELS[language][c]} for c in SkinConcern
        ],
        "categories": [
            {"value": c.value, "label": CATEGORY_LABELS[language][c]} for c in ProductCategory
        ],
        "age_ranges": _age_ranges(language),
    }


@app.post("/api/recommend", response_model=RecommendationResponse)
async def recommend(profile: UserProfile, lang: str = Query("zh")):
    language = normalize_lang(lang)
    if not profile.categories:
        profile.categories = list(ProductCategory)

    raw_recs = recommend_products(app.state.products, profile, language)
    enriched: dict[str, list[ProductRecommendation]] = {}
    for cat, recs in raw_recs.items():
        enriched[cat] = []
        for rec in recs:
            product_data = _product_with_benefits(rec.product, language)
            enriched[cat].append(
                ProductRecommendation(
                    product=Product(**product_data),
                    match_score=rec.match_score,
                    match_reasons=rec.match_reasons,
                    warnings=rec.warnings,
                )
            )
    return RecommendationResponse(profile=profile, recommendations=enriched)


@app.post("/api/scrape/refresh")
async def scrape_refresh():
    result = await refresh_products_from_sephora()
    app.state.products = load_products()
    return result


def _product_with_benefits(product: Product, lang: Lang) -> dict:
    data = product.model_dump()
    data["benefits"] = derive_benefits(product, lang)
    return data


def _age_ranges(lang: Lang) -> list[dict[str, str]]:
    labels = {
        Lang.EN: [
            ("", "Any age"),
            ("under-25", "Under 25"),
            ("25-35", "25–35"),
            ("35-45", "35–45"),
            ("45+", "45+"),
        ],
        Lang.FR: [
            ("", "Tout âge"),
            ("under-25", "Moins de 25 ans"),
            ("25-35", "25–35 ans"),
            ("35-45", "35–45 ans"),
            ("45+", "45 ans et +"),
        ],
        Lang.ZH: [
            ("", "不限"),
            ("under-25", "25岁以下"),
            ("25-35", "25-35岁"),
            ("35-45", "35-45岁"),
            ("45+", "45岁以上"),
        ],
    }
    return [{"value": v, "label": lbl} for v, lbl in labels[lang]]
