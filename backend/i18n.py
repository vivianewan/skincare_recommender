from enum import Enum

from models import ProductCategory, SkinConcern, SkinType

SUPPORTED_LANGS = ("en", "fr", "zh")


class Lang(str, Enum):
    EN = "en"
    FR = "fr"
    ZH = "zh"


def normalize_lang(lang: str | None) -> Lang:
    if not lang:
        return Lang.ZH
    key = lang.lower().split("-")[0]
    try:
        return Lang(key)
    except ValueError:
        return Lang.ZH


SKIN_TYPE_LABELS: dict[Lang, dict[SkinType, str]] = {
    Lang.EN: {
        SkinType.OILY: "Oily",
        SkinType.DRY: "Dry",
        SkinType.COMBINATION: "Combination",
        SkinType.SENSITIVE: "Sensitive",
        SkinType.NORMAL: "Normal",
    },
    Lang.FR: {
        SkinType.OILY: "Grasse",
        SkinType.DRY: "Sèche",
        SkinType.COMBINATION: "Mixte",
        SkinType.SENSITIVE: "Sensible",
        SkinType.NORMAL: "Normale",
    },
    Lang.ZH: {
        SkinType.OILY: "油性肌",
        SkinType.DRY: "干性肌",
        SkinType.COMBINATION: "混合肌",
        SkinType.SENSITIVE: "敏感肌",
        SkinType.NORMAL: "中性肌",
    },
}

CONCERN_LABELS: dict[Lang, dict[SkinConcern, str]] = {
    Lang.EN: {
        SkinConcern.ACNE: "Acne / Breakouts",
        SkinConcern.AGING: "Anti-aging",
        SkinConcern.SAGGING: "Sagging / Loss of firmness",
        SkinConcern.FINE_LINES: "Fine lines / Wrinkles",
        SkinConcern.DARK_SPOTS: "Dark spots / Hyperpigmentation",
        SkinConcern.REDNESS: "Redness / Sensitivity",
        SkinConcern.DEHYDRATION: "Dryness / Dehydration",
        SkinConcern.OILINESS: "Excess oil / Shine",
        SkinConcern.PORES: "Large pores",
        SkinConcern.DULLNESS: "Dull complexion",
    },
    Lang.FR: {
        SkinConcern.ACNE: "Acné / Boutons",
        SkinConcern.AGING: "Anti-âge",
        SkinConcern.SAGGING: "Relâchement / Perte de fermeté",
        SkinConcern.FINE_LINES: "Rides / Ridules",
        SkinConcern.DARK_SPOTS: "Taches / Pigmentation",
        SkinConcern.REDNESS: "Rougeurs / Sensibilité",
        SkinConcern.DEHYDRATION: "Sécheresse / Déshydratation",
        SkinConcern.OILINESS: "Excès de sébum / Brillance",
        SkinConcern.PORES: "Pores dilatés",
        SkinConcern.DULLNESS: "Teint terne",
    },
    Lang.ZH: {
        SkinConcern.ACNE: "痘痘 / 粉刺",
        SkinConcern.AGING: "抗衰老",
        SkinConcern.SAGGING: "下垂 / 松弛",
        SkinConcern.FINE_LINES: "细纹 / 皱纹",
        SkinConcern.DARK_SPOTS: "色斑 / 暗沉",
        SkinConcern.REDNESS: "泛红 / 敏感",
        SkinConcern.DEHYDRATION: "干燥 / 缺水",
        SkinConcern.OILINESS: "出油 / 油光",
        SkinConcern.PORES: "毛孔粗大",
        SkinConcern.DULLNESS: "肤色暗沉",
    },
}

CATEGORY_LABELS: dict[Lang, dict[ProductCategory, str]] = {
    Lang.EN: {
        ProductCategory.CLEANSER: "Cleanser",
        ProductCategory.TONER: "Toner",
        ProductCategory.SERUM: "Serum",
        ProductCategory.DAY_CREAM: "Day Cream",
        ProductCategory.NIGHT_CREAM: "Night Cream",
        ProductCategory.EYE_CREAM: "Eye Cream",
        ProductCategory.SUNSCREEN: "Sunscreen",
        ProductCategory.MASK: "Mask",
    },
    Lang.FR: {
        ProductCategory.CLEANSER: "Nettoyant",
        ProductCategory.TONER: "Tonique",
        ProductCategory.SERUM: "Sérum",
        ProductCategory.DAY_CREAM: "Crème de jour",
        ProductCategory.NIGHT_CREAM: "Crème de nuit",
        ProductCategory.EYE_CREAM: "Contour des yeux",
        ProductCategory.SUNSCREEN: "Protection solaire",
        ProductCategory.MASK: "Masque",
    },
    Lang.ZH: {
        ProductCategory.CLEANSER: "洗面奶",
        ProductCategory.TONER: "护肤水",
        ProductCategory.SERUM: "精华",
        ProductCategory.DAY_CREAM: "日霜",
        ProductCategory.NIGHT_CREAM: "晚霜",
        ProductCategory.EYE_CREAM: "眼霜",
        ProductCategory.SUNSCREEN: "防晒",
        ProductCategory.MASK: "面膜",
    },
}

BENEFIT_LABELS: dict[Lang, dict[SkinConcern, str]] = {
    Lang.EN: {
        SkinConcern.ACNE: "Clears breakouts",
        SkinConcern.AGING: "Anti-aging",
        SkinConcern.SAGGING: "Firms & lifts",
        SkinConcern.FINE_LINES: "Smooths fine lines",
        SkinConcern.DARK_SPOTS: "Brightens dark spots",
        SkinConcern.REDNESS: "Soothes redness",
        SkinConcern.DEHYDRATION: "Deep hydration",
        SkinConcern.OILINESS: "Controls oil",
        SkinConcern.PORES: "Minimizes pores",
        SkinConcern.DULLNESS: "Boosts radiance",
    },
    Lang.FR: {
        SkinConcern.ACNE: "Anti-imperfections",
        SkinConcern.AGING: "Anti-âge",
        SkinConcern.SAGGING: "Raffermit la peau",
        SkinConcern.FINE_LINES: "Lisse les ridules",
        SkinConcern.DARK_SPOTS: "Éclaircit les taches",
        SkinConcern.REDNESS: "Apaise les rougeurs",
        SkinConcern.DEHYDRATION: "Hydratation intense",
        SkinConcern.OILINESS: "Régule le sébum",
        SkinConcern.PORES: "Resserre les pores",
        SkinConcern.DULLNESS: "Éclat du teint",
    },
    Lang.ZH: {
        SkinConcern.ACNE: "祛痘控油",
        SkinConcern.AGING: "抗衰老",
        SkinConcern.SAGGING: "紧致提拉",
        SkinConcern.FINE_LINES: "淡化细纹",
        SkinConcern.DARK_SPOTS: "淡斑提亮",
        SkinConcern.REDNESS: "舒缓泛红",
        SkinConcern.DEHYDRATION: "深层保湿",
        SkinConcern.OILINESS: "控油哑光",
        SkinConcern.PORES: "收缩毛孔",
        SkinConcern.DULLNESS: "焕亮肤色",
    },
}

MESSAGES: dict[Lang, dict[str, str]] = {
    Lang.EN: {
        "suitable_skin": "Suitable for {skin} skin",
        "ingredient_helps": "{ingredient} helps with {concern}",
        "targets_concern": "Targets {concern}",
        "high_rating": "High rating {rating}/5 ({count} reviews)",
        "good_rating": "Good rating {rating}/5",
        "user_review": "User review: {text}",
        "irritant_warning": "Contains potential irritant: {ingredient}",
        "irritation_feedback": "Some users report irritation",
        "oily_feedback": "Some oily-skin users find it too heavy",
        "fragrance_warning": "Contains fragrance — not fragrance-free",
        "over_budget": "Price ${price} exceeds budget ${budget}",
        "well_reviewed": "Well-reviewed on Sephora",
    },
    Lang.FR: {
        "suitable_skin": "Convient aux peaux {skin}",
        "ingredient_helps": "Le {ingredient} aide contre {concern}",
        "targets_concern": "Cible {concern}",
        "high_rating": "Excellente note {rating}/5 ({count} avis)",
        "good_rating": "Bonne note {rating}/5",
        "user_review": "Avis client : {text}",
        "irritant_warning": "Contient un irritant potentiel : {ingredient}",
        "irritation_feedback": "Certains utilisateurs signalent des irritations",
        "oily_feedback": "Certaines peaux grasses le trouvent trop riche",
        "fragrance_warning": "Contient du parfum — pas sans parfum",
        "over_budget": "Prix ${price} dépasse le budget ${budget}",
        "well_reviewed": "Bien noté sur Sephora",
    },
    Lang.ZH: {
        "suitable_skin": "适合{skin}肤质",
        "ingredient_helps": "含{ingredient}，有助于改善{concern}",
        "targets_concern": "针对{concern}问题设计",
        "high_rating": "高评分 {rating}/5（{count}条评价）",
        "good_rating": "良好评分 {rating}/5",
        "user_review": "用户评价：{text}",
        "irritant_warning": "含可能刺激成分：{ingredient}",
        "irritation_feedback": "部分用户反馈有刺激感",
        "oily_feedback": "部分油皮用户觉得偏油腻",
        "fragrance_warning": "含香精，不符合无香偏好",
        "over_budget": "价格 ${price} 超出预算 ${budget}",
        "well_reviewed": "Sephora 好评产品",
    },
}
