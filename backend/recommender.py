from i18n import (
    BENEFIT_LABELS,
    CONCERN_LABELS,
    Lang,
    MESSAGES,
    SKIN_TYPE_LABELS,
)
import random
from models import (
    Product,
    ProductCategory,
    ProductRecommendation,
    SkinConcern,
    SkinType,
    UserProfile,
)

INGREDIENT_SKIN_BENEFITS: dict[str, dict[str, float]] = {
    "hyaluronic acid": {"dry": 1.0, "dehydration": 1.0, "combination": 0.5, "normal": 0.3, "fine_lines": 0.8},
    "niacinamide": {"oily": 0.8, "pores": 1.0, "dark_spots": 0.7, "combination": 0.6, "oiliness": 0.9},
    "salicylic acid": {"oily": 1.0, "acne": 1.0, "pores": 0.9, "oiliness": 0.8},
    "retinol": {"aging": 1.0, "dullness": 0.8, "dark_spots": 0.7, "fine_lines": 1.0, "sagging": 0.7},
    "vitamin c": {"dark_spots": 1.0, "dullness": 0.9, "aging": 0.6, "sagging": 0.5},
    "ceramide": {"dry": 1.0, "sensitive": 0.8, "dehydration": 0.9},
    "centella asiatica": {"sensitive": 1.0, "redness": 0.9},
    "aloe vera": {"sensitive": 0.8, "redness": 0.7, "dry": 0.5},
    "glycolic acid": {"dullness": 0.9, "aging": 0.7, "dark_spots": 0.6, "fine_lines": 0.7},
    "peptide": {"aging": 1.0, "dry": 0.4, "sagging": 1.0, "fine_lines": 0.9},
    "zinc oxide": {"sensitive": 0.7, "redness": 0.5},
    "tea tree": {"acne": 0.9, "oily": 0.7, "oiliness": 0.8},
    "squalane": {"dry": 0.9, "sensitive": 0.6, "dehydration": 0.7},
    "bakuchiol": {"aging": 0.8, "sensitive": 0.7, "fine_lines": 0.8},
    "caffeine": {"pores": 0.5, "aging": 0.4, "sagging": 0.6},
    "azelaic acid": {"acne": 0.8, "redness": 0.8, "dark_spots": 0.7},
    "proxylane": {"sagging": 1.0, "aging": 0.9, "fine_lines": 0.8},
}

CONCERN_KEYWORDS: dict[SkinConcern, list[str]] = {
    SkinConcern.ACNE: ["acne", "breakout", "blemish", "clear", "pimple"],
    SkinConcern.AGING: ["anti-aging", "wrinkle", "firm", "fine line", "youth"],
    SkinConcern.SAGGING: ["firm", "lift", "elastic", "sag", "tighten", "crepiness"],
    SkinConcern.FINE_LINES: ["fine line", "wrinkle", "smooth", "plump"],
    SkinConcern.DARK_SPOTS: ["dark spot", "hyperpigmentation", "brighten", "even tone"],
    SkinConcern.REDNESS: ["redness", "calm", "soothe", "irritat"],
    SkinConcern.DEHYDRATION: ["hydrat", "moistur", "plump", "dry skin"],
    SkinConcern.OILINESS: ["oily", "greasy", "oil control", "mattif", "shine"],
    SkinConcern.PORES: ["pore", "refine", "minimize"],
    SkinConcern.DULLNESS: ["glow", "radiant", "bright", "dull"],
}

IRRITANT_INGREDIENTS = {"fragrance", "alcohol denat", "essential oil", "menthol", "limonene"}


def _msg(lang: Lang, key: str, **kwargs: str | int | float) -> str:
    template = MESSAGES[lang].get(key, MESSAGES[Lang.EN].get(key, key))
    return template.format(**kwargs)


def _concern_label(lang: Lang, concern: SkinConcern) -> str:
    return CONCERN_LABELS[lang][concern]


def _skin_label(lang: Lang, skin: SkinType) -> str:
    return SKIN_TYPE_LABELS[lang][skin]


def _concern_relevance(product: Product, profile: UserProfile) -> bool:
    """Product must target at least one user concern (not just high rating)."""
    if not profile.concerns:
        return True

    user = {c.value for c in profile.concerns}
    product_addrs = {c.value for c in product.addresses_concerns}
    if user & product_addrs:
        return True

    ingredients_lower = [i.lower() for i in product.ingredients]
    for ingredient in ingredients_lower:
        benefits = INGREDIENT_SKIN_BENEFITS.get(ingredient, {})
        for concern in profile.concerns:
            if concern.value in benefits and benefits[concern.value] >= 0.8:
                return True

    return False


def _ingredient_match_score(
    product: Product, profile: UserProfile, lang: Lang
) -> tuple[float, list[str]]:
    score = 0.0
    reasons: list[str] = []
    ingredients_lower = [i.lower() for i in product.ingredients]

    if profile.skin_type in product.suitable_skin_types:
        score += 2.0
        reasons.append(
            _msg(lang, "suitable_skin", skin=_skin_label(lang, profile.skin_type))
        )

    for ingredient in ingredients_lower:
        benefits = INGREDIENT_SKIN_BENEFITS.get(ingredient, {})
        skin_key = profile.skin_type.value
        if skin_key in benefits:
            score += benefits[skin_key] * 1.5

        for concern in profile.concerns:
            if concern.value in benefits:
                score += benefits[concern.value] * 2.0
                reasons.append(
                    _msg(
                        lang,
                        "ingredient_helps",
                        ingredient=ingredient,
                        concern=_concern_label(lang, concern),
                    )
                )

    for concern in profile.concerns:
        if concern in product.addresses_concerns:
            score += 1.5
            target = _msg(lang, "targets_concern", concern=_concern_label(lang, concern))
            if target not in reasons:
                reasons.append(target)

    return score, reasons


def _review_match_score(
    product: Product, profile: UserProfile, lang: Lang
) -> tuple[float, list[str], list[str]]:
    score = 0.0
    reasons: list[str] = []
    warnings: list[str] = []

    rating_score = (product.rating / 5.0) * 3.0
    score += rating_score
    if product.rating >= 4.5:
        reasons.append(
            _msg(
                lang,
                "high_rating",
                rating=product.rating,
                count=product.review_count,
            )
        )
    elif product.rating >= 4.0:
        reasons.append(_msg(lang, "good_rating", rating=product.rating))

    pros_text = " ".join(product.pros).lower()
    cons_text = " ".join(product.cons).lower()

    for concern in profile.concerns:
        keywords = CONCERN_KEYWORDS.get(concern, [])
        for kw in keywords:
            if kw in pros_text:
                score += 0.8
                matched = next((p for p in product.pros if kw in p.lower()), "—")
                reasons.append(_msg(lang, "user_review", text=matched[:80]))
                break

    skin_type_keywords = {
        SkinType.OILY: ["oily", "greasy", "lightweight", "non-greasy", "mattif"],
        SkinType.DRY: ["dry", "hydrating", "moisturizing", "nourishing"],
        SkinType.SENSITIVE: ["sensitive", "gentle", "irritat", "calm"],
        SkinType.COMBINATION: ["combination", "balanced"],
    }
    for kw in skin_type_keywords.get(profile.skin_type, []):
        if kw in pros_text:
            score += 0.5

    if profile.skin_type == SkinType.SENSITIVE:
        for irritant in IRRITANT_INGREDIENTS:
            if any(irritant in ing.lower() for ing in product.ingredients):
                score -= 1.5
                warnings.append(_msg(lang, "irritant_warning", ingredient=irritant))
        if "irritat" in cons_text or "burn" in cons_text:
            score -= 1.0
            warnings.append(_msg(lang, "irritation_feedback"))

    if profile.skin_type == SkinType.OILY and ("greasy" in cons_text or "heavy" in cons_text):
        score -= 0.8
        warnings.append(_msg(lang, "oily_feedback"))

    if profile.fragrance_free:
        if any("fragrance" in ing.lower() for ing in product.ingredients):
            score -= 2.0
            warnings.append(_msg(lang, "fragrance_warning"))

    # Age-based boost: retinol/peptides for 35+
    if profile.age_range in ("35-45", "45+"):
        age_ingredients = {"retinol", "peptide", "proxylane", "bakuchiol"}
        if any(ing in age_ingredients for ing in [i.lower() for i in product.ingredients]):
            score += 1.0

    return score, reasons, warnings


def score_product(
    product: Product, profile: UserProfile, lang: Lang = Lang.ZH
) -> ProductRecommendation:
    if profile.budget_max and product.price > profile.budget_max:
        return ProductRecommendation(
            product=product,
            match_score=0,
            match_reasons=[],
            warnings=[
                _msg(
                    lang,
                    "over_budget",
                    price=product.price,
                    budget=profile.budget_max,
                )
            ],
        )

    ing_score, ing_reasons = _ingredient_match_score(product, profile, lang)
    rev_score, rev_reasons, warnings = _review_match_score(product, profile, lang)

    if profile.concerns and not _concern_relevance(product, profile):
        return ProductRecommendation(
            product=product,
            match_score=0,
            match_reasons=[],
            warnings=warnings,
        )

    total = ing_score + rev_score
    all_reasons = list(dict.fromkeys(ing_reasons + rev_reasons))[:5]

    return ProductRecommendation(
        product=product,
        match_score=round(total, 2),
        match_reasons=all_reasons,
        warnings=warnings,
    )


def _sort_results(rec: ProductRecommendation) -> tuple[float, float, float]:
    return (-rec.match_score, -rec.product.rating, rec.product.price)


def _select_varied_recommendations(
    scored: list[ProductRecommendation],
    top_n: int = 5,
    pool_size: int = 10,
) -> list[ProductRecommendation]:
    qualified = [s for s in scored if s.match_score > 0]
    if not qualified:
        return []

    pool = sorted(qualified, key=lambda x: x.match_score, reverse=True)[
        : min(pool_size, len(qualified))
    ]
    shuffled = pool.copy()
    random.shuffle(shuffled)
    selected = shuffled[: min(top_n, len(shuffled))]
    return sorted(selected, key=_sort_results)


def recommend_products(
    products: list[Product],
    profile: UserProfile,
    lang: Lang = Lang.ZH,
    top_n: int = 5,
) -> dict[str, list[ProductRecommendation]]:
    categories = profile.categories or list(ProductCategory)
    results: dict[str, list[ProductRecommendation]] = {}

    for category in categories:
        category_products = [p for p in products if p.category == category]
        scored = [score_product(p, profile, lang) for p in category_products]
        results[category.value] = _select_varied_recommendations(scored, top_n)

    return results


def derive_benefits(product: Product, lang: Lang) -> list[str]:
    if product.benefits:
        return product.benefits
    labels = BENEFIT_LABELS[lang]
    return [labels[c] for c in product.addresses_concerns if c in labels]
