import type { Lang } from '../i18n/translations';

export const SKIN_TYPES = ['oily', 'dry', 'combination', 'sensitive', 'normal'] as const;
export const CONCERNS = [
  'acne', 'aging', 'sagging', 'fine_lines', 'dark_spots', 'redness',
  'dehydration', 'oiliness', 'pores', 'dullness',
] as const;
export const CATEGORIES = [
  'cleanser', 'toner', 'serum', 'day_cream', 'night_cream',
  'eye_cream', 'sunscreen', 'mask',
] as const;

const SKIN_TYPE_LABELS: Record<Lang, Record<string, string>> = {
  en: { oily: 'Oily', dry: 'Dry', combination: 'Combination', sensitive: 'Sensitive', normal: 'Normal' },
  fr: { oily: 'Grasse', dry: 'Sèche', combination: 'Mixte', sensitive: 'Sensible', normal: 'Normale' },
  zh: { oily: '油性肌', dry: '干性肌', combination: '混合肌', sensitive: '敏感肌', normal: '中性肌' },
};

const CONCERN_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    acne: 'Acne / Breakouts', aging: 'Anti-aging', sagging: 'Sagging / Loss of firmness',
    fine_lines: 'Fine lines / Wrinkles', dark_spots: 'Dark spots / Hyperpigmentation',
    redness: 'Redness / Sensitivity', dehydration: 'Dryness / Dehydration',
    oiliness: 'Excess oil / Shine', pores: 'Large pores', dullness: 'Dull complexion',
  },
  fr: {
    acne: 'Acné / Boutons', aging: 'Anti-âge', sagging: 'Relâchement / Perte de fermeté',
    fine_lines: 'Rides / Ridules', dark_spots: 'Taches / Pigmentation',
    redness: 'Rougeurs / Sensibilité', dehydration: 'Sécheresse / Déshydratation',
    oiliness: 'Excès de sébum / Brillance', pores: 'Pores dilatés', dullness: 'Teint terne',
  },
  zh: {
    acne: '痘痘 / 粉刺', aging: '抗衰老', sagging: '下垂 / 松弛',
    fine_lines: '细纹 / 皱纹', dark_spots: '色斑 / 暗沉',
    redness: '泛红 / 敏感', dehydration: '干燥 / 缺水',
    oiliness: '出油 / 油光', pores: '毛孔粗大', dullness: '肤色暗沉',
  },
};

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    cleanser: 'Cleanser', toner: 'Toner', serum: 'Serum', day_cream: 'Day Cream',
    night_cream: 'Night Cream', eye_cream: 'Eye Cream', sunscreen: 'Sunscreen', mask: 'Mask',
  },
  fr: {
    cleanser: 'Nettoyant', toner: 'Tonique', serum: 'Sérum', day_cream: 'Crème de jour',
    night_cream: 'Crème de nuit', eye_cream: 'Contour des yeux',
    sunscreen: 'Protection solaire', mask: 'Masque',
  },
  zh: {
    cleanser: '洗面奶', toner: '护肤水', serum: '精华', day_cream: '日霜',
    night_cream: '晚霜', eye_cream: '眼霜', sunscreen: '防晒', mask: '面膜',
  },
};

const BENEFIT_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    acne: 'Clears breakouts', aging: 'Anti-aging', sagging: 'Firms & lifts',
    fine_lines: 'Smooths fine lines', dark_spots: 'Brightens dark spots',
    redness: 'Soothes redness', dehydration: 'Deep hydration',
    oiliness: 'Controls oil', pores: 'Minimizes pores', dullness: 'Boosts radiance',
  },
  fr: {
    acne: 'Anti-imperfections', aging: 'Anti-âge', sagging: 'Raffermit la peau',
    fine_lines: 'Lisse les ridules', dark_spots: 'Éclaircit les taches',
    redness: 'Apaise les rougeurs', dehydration: 'Hydratation intense',
    oiliness: 'Régule le sébum', pores: 'Resserre les pores', dullness: 'Éclat du teint',
  },
  zh: {
    acne: '祛痘控油', aging: '抗衰老', sagging: '紧致提拉',
    fine_lines: '淡化细纹', dark_spots: '淡斑提亮',
    redness: '舒缓泛红', dehydration: '深层保湿',
    oiliness: '控油哑光', pores: '收缩毛孔', dullness: '焕亮肤色',
  },
};

const AGE_RANGES: Record<Lang, { value: string; label: string }[]> = {
  en: [
    { value: '', label: 'Any age' },
    { value: 'under-25', label: 'Under 25' },
    { value: '25-35', label: '25–35' },
    { value: '35-45', label: '35–45' },
    { value: '45+', label: '45+' },
  ],
  fr: [
    { value: '', label: 'Tout âge' },
    { value: 'under-25', label: 'Moins de 25 ans' },
    { value: '25-35', label: '25–35 ans' },
    { value: '35-45', label: '35–45 ans' },
    { value: '45+', label: '45 ans et +' },
  ],
  zh: [
    { value: '', label: '不限' },
    { value: 'under-25', label: '25岁以下' },
    { value: '25-35', label: '25-35岁' },
    { value: '35-45', label: '35-45岁' },
    { value: '45+', label: '45岁以上' },
  ],
};

export function buildMeta(lang: Lang) {
  return {
    lang,
    skin_types: SKIN_TYPES.map((v) => ({ value: v, label: SKIN_TYPE_LABELS[lang][v] })),
    concerns: CONCERNS.map((v) => ({ value: v, label: CONCERN_LABELS[lang][v] })),
    categories: CATEGORIES.map((v) => ({ value: v, label: CATEGORY_LABELS[lang][v] })),
    age_ranges: AGE_RANGES[lang],
  };
}

export function deriveBenefits(concerns: string[], lang: Lang, existing?: string[]): string[] {
  if (existing && existing.length > 0) return existing;
  return concerns.map((c) => BENEFIT_LABELS[lang][c]).filter(Boolean);
}
