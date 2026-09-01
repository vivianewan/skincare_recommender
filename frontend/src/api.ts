import type { Lang } from './i18n/translations';
import { buildMeta } from './lib/meta';
import { recommendProducts } from './lib/recommender';

export interface MetaOption {
  value: string;
  label: string;
}

export interface Meta {
  lang: string;
  skin_types: MetaOption[];
  concerns: MetaOption[];
  categories: MetaOption[];
  age_ranges: MetaOption[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  review_count: number;
  ingredients: string[];
  pros: string[];
  cons: string[];
  benefits: string[];
  suitable_skin_types: string[];
  addresses_concerns: string[];
  source: string;
  shipping_info: string;
  source_url?: string;
}

export interface ProductRecommendation {
  product: Product;
  match_score: number;
  match_reasons: string[];
  warnings: string[];
}

export interface UserProfile {
  skin_type: string;
  concerns: string[];
  age_range?: string;
  categories: string[];
  budget_max?: number;
  fragrance_free: boolean;
  vegan_preferred: boolean;
}

export interface RecommendationResponse {
  profile: UserProfile;
  recommendations: Record<string, ProductRecommendation[]>;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';
const STATIC_MODE = import.meta.env.VITE_STATIC === 'true';

export const isStaticMode = STATIC_MODE;

let productsCache: Product[] | null = null;

async function loadProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;
  const base = import.meta.env.BASE_URL;
  const res = await fetch(`${base}products.json`);
  if (!res.ok) throw new Error('Failed to load products');
  productsCache = await res.json();
  return productsCache!;
}

function langParam(lang: Lang): string {
  return `lang=${lang}`;
}

export async function fetchMeta(lang: Lang): Promise<Meta> {
  if (STATIC_MODE) return buildMeta(lang);
  try {
    const res = await fetch(`${API_BASE}/meta?${langParam(lang)}`);
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    return buildMeta(lang);
  }
}

export async function getRecommendations(
  profile: UserProfile,
  lang: Lang,
): Promise<RecommendationResponse> {
  if (STATIC_MODE) {
    const products = await loadProducts();
    const recommendations = recommendProducts(products, profile, lang);
    return { profile, recommendations };
  }
  try {
    const res = await fetch(`${API_BASE}/recommend?${langParam(lang)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    const products = await loadProducts();
    const recommendations = recommendProducts(products, profile, lang);
    return { profile, recommendations };
  }
}

export async function refreshProductData(): Promise<{
  message: string;
  total_products: number;
}> {
  if (STATIC_MODE) {
    productsCache = null;
    const products = await loadProducts();
    return { message: 'Static product library loaded', total_products: products.length };
  }
  const res = await fetch(`${API_BASE}/scrape/refresh`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to refresh data');
  return res.json();
}
