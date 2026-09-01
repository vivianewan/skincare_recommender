import type { ProductRecommendation } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  recommendations: Record<string, ProductRecommendation[]>;
  categoryLabels: Record<string, string>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
    </div>
  );
}

function ProductCard({ rec, rank }: { rec: ProductRecommendation; rank: number }) {
  const { t } = useLanguage();
  const { product, match_score, match_reasons, warnings } = rec;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
              {rank}
            </span>
            <div>
              <p className="text-xs font-medium text-brand-500 uppercase tracking-wide">{product.brand}</p>
              <h4 className="font-semibold text-gray-900 leading-tight">{product.name}</h4>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-xs text-gray-500">
                  {t('product.source')}: <span className="font-medium text-gray-700">{product.source}</span>
                </span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-500">
                  {t('product.shipping')}: <span className="font-medium text-gray-700">{product.shipping_info}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-0.5 justify-end">
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-400">
                ({product.review_count} {t('product.reviews')})
              </span>
            </div>
          </div>
        </div>

        {product.benefits && product.benefits.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1.5">{t('product.benefits')}</p>
            <div className="flex flex-wrap gap-1.5">
              {product.benefits.map((b) => (
                <span key={b} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-full">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1.5">{t('product.ingredients')}</p>
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.slice(0, 6).map((ing) => (
              <span key={ing} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs font-medium text-green-600 mb-1">👍 {t('product.pros')}</p>
            <ul className="space-y-1">
              {product.pros.slice(0, 2).map((pro, i) => (
                <li key={i} className="text-xs text-gray-600 line-clamp-2">• {pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-red-500 mb-1">👎 {t('product.cons')}</p>
            <ul className="space-y-1">
              {product.cons.length > 0 ? (
                product.cons.slice(0, 2).map((con, i) => (
                  <li key={i} className="text-xs text-gray-600 line-clamp-2">• {con}</li>
                ))
              ) : (
                <li className="text-xs text-gray-400">{t('product.noCons')}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-brand-50 rounded-xl p-3 mb-2 border border-brand-100">
          <p className="text-xs font-medium text-brand-700 mb-1">
            {t('product.match')} {match_score.toFixed(1)} — {t('product.matchReasons')}
          </p>
          <ul className="space-y-0.5">
            {match_reasons.map((reason, i) => (
              <li key={i} className="text-xs text-brand-800">✓ {reason}</li>
            ))}
          </ul>
        </div>

        {warnings.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-3">
            {warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-700">⚠ {w}</p>
            ))}
          </div>
        )}

        {product.source_url && (
          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-brand-600 hover:text-brand-800 underline"
          >
            {t('product.viewOn', { source: product.source })}
          </a>
        )}
      </div>
    </div>
  );
}

export default function RecommendationResults({ recommendations, categoryLabels }: Props) {
  const { t } = useLanguage();
  const categories = Object.keys(recommendations);

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">{t('results.empty')}</div>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((cat) => {
        const items = recommendations[cat];
        if (!items || items.length === 0) return null;

        return (
          <section key={cat}>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-600 rounded-full" />
              {categoryLabels[cat] || cat}
            </h3>
            <div className="grid gap-4 lg:grid-cols-1">
              {items.map((rec, i) => (
                <ProductCard key={rec.product.id} rec={rec} rank={i + 1} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
