import type { ProductRecommendation } from '../api';

/** Sort by rating (high → low), then price (low → high). */
export function sortByRatingThenPrice(a: ProductRecommendation, b: ProductRecommendation): number {
  if (b.product.rating !== a.product.rating) {
    return b.product.rating - a.product.rating;
  }
  return a.product.price - b.product.price;
}

/**
 * Pick up to `topN` products with slight random variation.
 * Candidates come from the best-matching pool, then final order is rating → price.
 */
export function selectVariedRecommendations(
  scored: ProductRecommendation[],
  topN = 5,
  poolSize = 15,
): ProductRecommendation[] {
  const qualified = scored.filter((s) => s.match_score > 0);
  if (qualified.length === 0) return [];

  const pool = [...qualified]
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, Math.min(poolSize, qualified.length));

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(topN, shuffled.length)).sort(sortByRatingThenPrice);
}
