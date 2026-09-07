import type { ProductRecommendation } from '../api';

/**
 * Display order:
 * 1. rating high → low
 * 2. same rating → review_count high → low
 * 3. still tied → price high → low (within selected budget range)
 */
export function sortResults(
  a: ProductRecommendation,
  b: ProductRecommendation,
): number {
  if (b.product.rating !== a.product.rating) {
    return b.product.rating - a.product.rating;
  }
  if (b.product.review_count !== a.product.review_count) {
    return b.product.review_count - a.product.review_count;
  }
  return b.product.price - a.product.price;
}

/** Collapse near-identical names (renames / filler words) for deduping. */
export function normalizeProductName(name: string): string {
  let s = name
    .toLowerCase()
    .replace(/masque/g, 'mask')
    .replace(/cr[eè]me/g, 'cream');
  s = s.replace(/[^a-z0-9\s]/g, ' ');
  s = s.replace(
    /\b(the|a|an|and|with|for|of|in|to|plus|mini|duo|set|refill|travel|face|facial|acne|clay|clearing|pore|pores|daily|advanced|formula)\b/g,
    ' ',
  );
  return s.replace(/\s+/g, ' ').trim();
}

function isNearDuplicateName(a: string, b: string): boolean {
  const na = normalizeProductName(a);
  const nb = normalizeProductName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) {
    const shorter = na.length <= nb.length ? na : nb;
    return shorter.split(' ').filter(Boolean).length >= 3;
  }
  return false;
}

/**
 * Drop near-duplicate SKUs (same brand + nearly identical name), keeping
 * the first occurrence (caller should pass items in preferred order).
 */
export function dedupeRecommendations(
  items: ProductRecommendation[],
): ProductRecommendation[] {
  const kept: ProductRecommendation[] = [];
  for (const item of items) {
    const brand = item.product.brand.toLowerCase().trim();
    const isDup = kept.some(
      (existing) =>
        existing.product.brand.toLowerCase().trim() === brand &&
        isNearDuplicateName(existing.product.name, item.product.name),
    );
    if (!isDup) kept.push(item);
  }
  return kept;
}

/**
 * Pick up to `topN` products with slight random variation.
 * Only products that genuinely match user concerns enter the pool.
 */
export function selectVariedRecommendations(
  scored: ProductRecommendation[],
  topN = 5,
  poolSize = 10,
): ProductRecommendation[] {
  const qualified = scored.filter((s) => s.match_score > 0);
  if (qualified.length === 0) return [];

  const pool = dedupeRecommendations(
    [...qualified].sort((a, b) => b.match_score - a.match_score),
  ).slice(0, Math.min(poolSize, qualified.length));

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(topN * 2, shuffled.length));
  return dedupeRecommendations([...selected].sort(sortResults)).slice(0, topN);
}
