import type { Lang } from '../i18n/translations';
import type { Product, ProductRecommendation, UserProfile } from '../api';
import { deriveBenefits } from './meta';

const INGREDIENT_BENEFITS: Record<string, Record<string, number>> = {
  'hyaluronic acid': { dry: 1.0, dehydration: 1.0, combination: 0.5, normal: 0.3, fine_lines: 0.8 },
  niacinamide: { oily: 0.8, pores: 1.0, dark_spots: 0.7, combination: 0.6, oiliness: 0.9 },
  'salicylic acid': { oily: 1.0, acne: 1.0, pores: 0.9, oiliness: 0.8 },
  retinol: { aging: 1.0, dullness: 0.8, dark_spots: 0.7, fine_lines: 1.0, sagging: 0.7 },
  'vitamin c': { dark_spots: 1.0, dullness: 0.9, aging: 0.6, sagging: 0.5 },
  ceramide: { dry: 1.0, sensitive: 0.8, dehydration: 0.9 },
  'centella asiatica': { sensitive: 1.0, redness: 0.9 },
  'aloe vera': { sensitive: 0.8, redness: 0.7, dry: 0.5 },
  'glycolic acid': { dullness: 0.9, aging: 0.7, dark_spots: 0.6, fine_lines: 0.7 },
  peptide: { aging: 1.0, dry: 0.4, sagging: 1.0, fine_lines: 0.9 },
  'zinc oxide': { sensitive: 0.7, redness: 0.5 },
  'tea tree': { acne: 0.9, oily: 0.7, oiliness: 0.8 },
  squalane: { dry: 0.9, sensitive: 0.6, dehydration: 0.7 },
  bakuchiol: { aging: 0.8, sensitive: 0.7, fine_lines: 0.8 },
  caffeine: { pores: 0.5, aging: 0.4, sagging: 0.6 },
  'azelaic acid': { acne: 0.8, redness: 0.8, dark_spots: 0.7 },
  proxylane: { sagging: 1.0, aging: 0.9, fine_lines: 0.8 },
};

const CONCERN_KEYWORDS: Record<string, string[]> = {
  acne: ['acne', 'breakout', 'blemish', 'clear', 'pimple'],
  aging: ['anti-aging', 'wrinkle', 'firm', 'fine line', 'youth'],
  sagging: ['firm', 'lift', 'elastic', 'sag', 'tighten', 'crepiness'],
  fine_lines: ['fine line', 'wrinkle', 'smooth', 'plump'],
  dark_spots: ['dark spot', 'hyperpigmentation', 'brighten', 'even tone'],
  redness: ['redness', 'calm', 'soothe', 'irritat'],
  dehydration: ['hydrat', 'moistur', 'plump', 'dry skin'],
  oiliness: ['oily', 'greasy', 'oil control', 'mattif', 'shine'],
  pores: ['pore', 'refine', 'minimize'],
  dullness: ['glow', 'radiant', 'bright', 'dull'],
};

const IRRITANTS = ['fragrance', 'alcohol denat', 'essential oil', 'menthol', 'limonene'];

const SKIN_LABELS: Record<Lang, Record<string, string>> = {
  en: { oily: 'Oily', dry: 'Dry', combination: 'Combination', sensitive: 'Sensitive', normal: 'Normal' },
  fr: { oily: 'grasse', dry: 'sèche', combination: 'mixte', sensitive: 'sensible', normal: 'normale' },
  zh: { oily: '油性', dry: '干性', combination: '混合', sensitive: '敏感', normal: '中性' },
};

const CONCERN_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    acne: 'acne', aging: 'aging', sagging: 'sagging', fine_lines: 'fine lines',
    dark_spots: 'dark spots', redness: 'redness', dehydration: 'dryness',
    oiliness: 'oiliness', pores: 'pores', dullness: 'dullness',
  },
  fr: {
    acne: 'l\'acné', aging: 'le vieillissement', sagging: 'le relâchement',
    fine_lines: 'les ridules', dark_spots: 'les taches', redness: 'les rougeurs',
    dehydration: 'la sécheresse', oiliness: 'l\'excès de sébum', pores: 'les pores', dullness: 'l\'éclat',
  },
  zh: {
    acne: '痘痘', aging: '衰老', sagging: '下垂', fine_lines: '细纹',
    dark_spots: '色斑', redness: '泛红', dehydration: '干燥',
    oiliness: '出油', pores: '毛孔', dullness: '暗沉',
  },
};

function msg(lang: Lang, key: string, vars: Record<string, string | number>): string {
  const templates: Record<Lang, Record<string, string>> = {
    en: {
      suitable: 'Suitable for {skin} skin',
      ingredient: '{ingredient} helps with {concern}',
      targets: 'Targets {concern}',
      highRating: 'High rating {rating}/5 ({count} reviews)',
      goodRating: 'Good rating {rating}/5',
      userReview: 'User review: {text}',
      irritant: 'Contains potential irritant: {ingredient}',
      irritation: 'Some users report irritation',
      oily: 'Some oily-skin users find it too heavy',
      fragrance: 'Contains fragrance — not fragrance-free',
      overBudget: 'Price ${price} exceeds budget ${budget}',
    },
    fr: {
      suitable: 'Convient aux peaux {skin}',
      ingredient: 'Le {ingredient} aide contre {concern}',
      targets: 'Cible {concern}',
      highRating: 'Excellente note {rating}/5 ({count} avis)',
      goodRating: 'Bonne note {rating}/5',
      userReview: 'Avis client : {text}',
      irritant: 'Contient un irritant potentiel : {ingredient}',
      irritation: 'Certains utilisateurs signalent des irritations',
      oily: 'Certaines peaux grasses le trouvent trop riche',
      fragrance: 'Contient du parfum — pas sans parfum',
      overBudget: 'Prix ${price} dépasse le budget ${budget}',
    },
    zh: {
      suitable: '适合{skin}肤质',
      ingredient: '含{ingredient}，有助于改善{concern}',
      targets: '针对{concern}问题设计',
      highRating: '高评分 {rating}/5（{count}条评价）',
      goodRating: '良好评分 {rating}/5',
      userReview: '用户评价：{text}',
      irritant: '含可能刺激成分：{ingredient}',
      irritation: '部分用户反馈有刺激感',
      oily: '部分油皮用户觉得偏油腻',
      fragrance: '含香精，不符合无香偏好',
      overBudget: '价格 ${price} 超出预算 ${budget}',
    },
  };
  let text = templates[lang][key] ?? templates.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, String(v));
  }
  return text;
}

function scoreProduct(product: Product, profile: UserProfile, lang: Lang): ProductRecommendation {
  if (profile.budget_max && product.price > profile.budget_max) {
    return {
      product,
      match_score: 0,
      match_reasons: [],
      warnings: [msg(lang, 'overBudget', { price: product.price, budget: profile.budget_max })],
    };
  }

  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const ingredientsLower = product.ingredients.map((i) => i.toLowerCase());

  if (product.suitable_skin_types.includes(profile.skin_type)) {
    score += 2;
    reasons.push(msg(lang, 'suitable', { skin: SKIN_LABELS[lang][profile.skin_type] }));
  }

  for (const ingredient of ingredientsLower) {
    const benefits = INGREDIENT_BENEFITS[ingredient] ?? {};
    if (benefits[profile.skin_type]) score += benefits[profile.skin_type] * 1.5;
    for (const concern of profile.concerns) {
      if (benefits[concern]) {
        score += benefits[concern] * 2;
        reasons.push(msg(lang, 'ingredient', {
          ingredient,
          concern: CONCERN_LABELS[lang][concern] ?? concern,
        }));
      }
    }
  }

  for (const concern of profile.concerns) {
    if (product.addresses_concerns.includes(concern)) {
      score += 1.5;
      const t = msg(lang, 'targets', { concern: CONCERN_LABELS[lang][concern] ?? concern });
      if (!reasons.includes(t)) reasons.push(t);
    }
  }

  score += (product.rating / 5) * 3;
  if (product.rating >= 4.5) {
    reasons.push(msg(lang, 'highRating', { rating: product.rating, count: product.review_count }));
  } else if (product.rating >= 4.0) {
    reasons.push(msg(lang, 'goodRating', { rating: product.rating }));
  }

  const prosText = product.pros.join(' ').toLowerCase();
  const consText = product.cons.join(' ').toLowerCase();

  for (const concern of profile.concerns) {
    const keywords = CONCERN_KEYWORDS[concern] ?? [];
    for (const kw of keywords) {
      if (prosText.includes(kw)) {
        score += 0.8;
        const matched = product.pros.find((p) => p.toLowerCase().includes(kw)) ?? '—';
        reasons.push(msg(lang, 'userReview', { text: matched.slice(0, 80) }));
        break;
      }
    }
  }

  if (profile.skin_type === 'sensitive') {
    for (const irritant of IRRITANTS) {
      if (ingredientsLower.some((i) => i.includes(irritant))) {
        score -= 1.5;
        warnings.push(msg(lang, 'irritant', { ingredient: irritant }));
      }
    }
    if (consText.includes('irritat') || consText.includes('burn')) {
      score -= 1;
      warnings.push(msg(lang, 'irritation', {}));
    }
  }

  if (profile.skin_type === 'oily' && (consText.includes('greasy') || consText.includes('heavy'))) {
    score -= 0.8;
    warnings.push(msg(lang, 'oily', {}));
  }

  if (profile.fragrance_free && ingredientsLower.some((i) => i.includes('fragrance'))) {
    score -= 2;
    warnings.push(msg(lang, 'fragrance', {}));
  }

  if (profile.age_range === '35-45' || profile.age_range === '45+') {
    const ageIngs = ['retinol', 'peptide', 'proxylane', 'bakuchiol'];
    if (ingredientsLower.some((i) => ageIngs.some((a) => i.includes(a)))) score += 1;
  }

  const uniqueReasons = [...new Set(reasons)].slice(0, 5);
  const enriched: Product = {
    ...product,
    benefits: deriveBenefits(product.addresses_concerns, lang, product.benefits),
  };

  return {
    product: enriched,
    match_score: Math.round(score * 100) / 100,
    match_reasons: uniqueReasons,
    warnings,
  };
}

export function recommendProducts(
  products: Product[],
  profile: UserProfile,
  lang: Lang,
  topN = 5,
): Record<string, ProductRecommendation[]> {
  const categories = profile.categories.length > 0 ? profile.categories : [
    'cleanser', 'toner', 'serum', 'day_cream', 'night_cream', 'eye_cream', 'sunscreen', 'mask',
  ];
  const results: Record<string, ProductRecommendation[]> = {};

  for (const category of categories) {
    const scored = products
      .filter((p) => p.category === category)
      .map((p) => scoreProduct(p, profile, lang))
      .filter((s) => s.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score);
    results[category] = scored.slice(0, topN);
  }

  return results;
}
