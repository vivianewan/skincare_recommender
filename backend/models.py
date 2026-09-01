from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SkinType(str, Enum):
    OILY = "oily"
    DRY = "dry"
    COMBINATION = "combination"
    SENSITIVE = "sensitive"
    NORMAL = "normal"


class SkinConcern(str, Enum):
    ACNE = "acne"
    AGING = "aging"
    SAGGING = "sagging"
    FINE_LINES = "fine_lines"
    DARK_SPOTS = "dark_spots"
    REDNESS = "redness"
    DEHYDRATION = "dehydration"
    OILINESS = "oiliness"
    PORES = "pores"
    DULLNESS = "dullness"


class ProductCategory(str, Enum):
    CLEANSER = "cleanser"
    TONER = "toner"
    SERUM = "serum"
    DAY_CREAM = "day_cream"
    NIGHT_CREAM = "night_cream"
    EYE_CREAM = "eye_cream"
    SUNSCREEN = "sunscreen"
    MASK = "mask"


class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: ProductCategory
    price: float
    rating: float
    review_count: int
    ingredients: list[str]
    pros: list[str]
    cons: list[str]
    suitable_skin_types: list[SkinType]
    addresses_concerns: list[SkinConcern]
    benefits: list[str] = Field(default_factory=list)
    source: str = "Sephora"
    shipping_info: str = "Free shipping on orders $50+ (US)"
    source_url: Optional[str] = None
    image_url: Optional[str] = None


class UserProfile(BaseModel):
    skin_type: SkinType
    concerns: list[SkinConcern] = Field(default_factory=list)
    age_range: Optional[str] = None
    categories: list[ProductCategory] = Field(default_factory=list)
    budget_max: Optional[float] = None
    fragrance_free: bool = False
    vegan_preferred: bool = False


class ProductRecommendation(BaseModel):
    product: Product
    match_score: float
    match_reasons: list[str]
    warnings: list[str] = Field(default_factory=list)


class RecommendationResponse(BaseModel):
    profile: UserProfile
    recommendations: dict[str, list[ProductRecommendation]]
