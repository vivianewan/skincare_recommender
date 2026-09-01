import type { Lang } from './i18n/translations';

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

const API_BASE = '/api';

function langParam(lang: Lang): string {
  return `lang=${lang}`;
}

export async function fetchMeta(lang: Lang): Promise<Meta> {
  const res = await fetch(`${API_BASE}/meta?${langParam(lang)}`);
  if (!res.ok) throw new Error('Failed to fetch meta');
  return res.json();
}

export async function getRecommendations(
  profile: UserProfile,
  lang: Lang,
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommend?${langParam(lang)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to get recommendations');
  return res.json();
}

export async function refreshProductData(): Promise<{
  message: string;
  total_products: number;
}> {
  const res = await fetch(`${API_BASE}/scrape/refresh`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to refresh data');
  return res.json();
}
