export type Lang = 'en' | 'fr' | 'zh';

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  zh: '中文',
};

type TranslationDict = Record<string, string>;

const en: TranslationDict = {
  'app.title': 'SkinMatch',
  'app.subtitle': 'Ingredient analysis & review-powered recommendations',
  'app.hero.title': 'Find skincare that fits you',
  'app.hero.desc':
    'Tell us about your skin and goals, we will recommend the best products for you.',
  'logo.upload': 'Upload logo',
  'logo.change': 'Change',
  'logo.reset': 'Reset',
  'app.results.title': 'Your personalized routine',
  'app.results.subtitle': 'Matched to your skin profile and concerns',
  'app.back': '← Edit profile',
  'app.refresh': 'Refresh Sephora data',
  'app.refreshing': 'Updating...',
  'app.loading': 'Loading...',
  'app.footer': 'Data source: Sephora · Recommendations based on ingredients & reviews',
  'error.backend': 'Cannot connect to API. Please ensure the backend is running.',
  'error.recommend': 'Failed to get recommendations. Please try again.',
  'error.refresh': 'Data refresh failed. Using local product library.',
  'form.step1': 'Your skin type',
  'form.step2': 'Skin concerns (select all that apply)',
  'form.step3': 'Product categories needed (leave empty for full routine)',
  'form.budget': 'Max budget (USD, optional)',
  'form.budget.placeholder': 'e.g. 50',
  'form.age': 'Age range (optional)',
  'form.fragrance': 'Prefer fragrance-free products',
  'form.submit': 'Get recommendations',
  'form.submitting': 'Analyzing...',
  'results.empty': 'No matching products. Try adjusting your filters.',
  'product.ingredients': 'Key ingredients',
  'product.benefits': 'Benefits',
  'product.pros': 'What users love',
  'product.cons': 'Common complaints',
  'product.match': 'Match score',
  'product.matchReasons': 'Why we recommend it',
  'product.source': 'Source',
  'product.shipping': 'Shipping',
  'product.viewOn': 'View on {source} →',
  'product.noCons': 'No significant complaints',
  'product.reviews': 'reviews',
};

const fr: TranslationDict = {
  'app.title': 'SkinMatch',
  'app.subtitle': 'Analyse des ingrédients et recommandations basées sur les avis',
  'app.hero.title': 'Trouvez les soins adaptés à votre peau',
  'app.hero.desc':
    'Décrivez votre peau et vos objectifs, nous vous recommanderons les meilleurs produits.',
  'logo.upload': 'Télécharger le logo',
  'logo.change': 'Modifier',
  'logo.reset': 'Réinitialiser',
  'app.results.title': 'Votre routine personnalisée',
  'app.results.subtitle': 'Adaptée à votre profil cutané',
  'app.back': '← Modifier le profil',
  'app.refresh': 'Actualiser les données Sephora',
  'app.refreshing': 'Mise à jour...',
  'app.loading': 'Chargement...',
  'app.footer': 'Source : Sephora · Recommandations basées sur ingrédients et avis',
  'error.backend': 'Impossible de se connecter à l\'API. Vérifiez que le backend est démarré.',
  'error.recommend': 'Échec des recommandations. Veuillez réessayer.',
  'error.refresh': 'Échec de la mise à jour. Utilisation de la bibliothèque locale.',
  'form.step1': 'Votre type de peau',
  'form.step2': 'Préoccupations cutanées (plusieurs choix possibles)',
  'form.step3': 'Catégories souhaitées (vide = routine complète)',
  'form.budget': 'Budget max (USD, optionnel)',
  'form.budget.placeholder': 'ex. 50',
  'form.age': 'Tranche d\'âge (optionnel)',
  'form.fragrance': 'Préférence pour des produits sans parfum',
  'form.submit': 'Obtenir des recommandations',
  'form.submitting': 'Analyse en cours...',
  'results.empty': 'Aucun produit correspondant. Essayez d\'ajuster vos critères.',
  'product.ingredients': 'Ingrédients clés',
  'product.benefits': 'Bienfaits',
  'product.pros': 'Points positifs',
  'product.cons': 'Points négatifs',
  'product.match': 'Score de correspondance',
  'product.matchReasons': 'Pourquoi nous le recommandons',
  'product.source': 'Source',
  'product.shipping': 'Livraison',
  'product.viewOn': 'Voir sur {source} →',
  'product.noCons': 'Pas de plaintes significatives',
  'product.reviews': 'avis',
};

const zh: TranslationDict = {
  'app.title': '护肤智选',
  'app.subtitle': '基于成分分析与用户评价的智能推荐',
  'app.hero.title': '找到最适合你的护肤品',
  'app.hero.desc':
    '告诉我们你的肤质和需求，我们将为你推荐最合适的护肤产品。',
  'logo.upload': '上传图标',
  'logo.change': '更换',
  'logo.reset': '恢复默认',
  'app.results.title': '你的专属护肤方案',
  'app.results.subtitle': '根据你的肤质特征和需求智能匹配',
  'app.back': '← 重新填写',
  'app.refresh': '刷新 Sephora 数据',
  'app.refreshing': '更新中...',
  'app.loading': '加载中...',
  'app.footer': '数据来源：Sephora 产品库 · 推荐算法基于成分匹配与用户评价分析',
  'error.backend': '无法连接后端服务，请确保 API 已启动',
  'error.recommend': '获取推荐失败，请稍后重试',
  'error.refresh': '数据更新失败，将使用本地产品库',
  'form.step1': '您的肤质类型',
  'form.step2': '肌肤困扰（可多选）',
  'form.step3': '需要的产品类别（可多选，不选则推荐全套）',
  'form.budget': '预算上限（美元，可选）',
  'form.budget.placeholder': '例如：50',
  'form.age': '年龄段（可选）',
  'form.fragrance': '偏好无香精产品',
  'form.submit': '获取个性化推荐',
  'form.submitting': '正在分析推荐...',
  'results.empty': '暂无匹配的产品，请尝试调整筛选条件。',
  'product.ingredients': '主要成分',
  'product.benefits': '功效',
  'product.pros': '用户好评',
  'product.cons': '用户差评',
  'product.match': '匹配度',
  'product.matchReasons': '推荐理由',
  'product.source': '来源',
  'product.shipping': '运费',
  'product.viewOn': '在 {source} 查看 →',
  'product.noCons': '暂无显著差评',
  'product.reviews': '条评价',
};

export const translations: Record<Lang, TranslationDict> = { en, fr, zh };

export function t(lang: Lang, key: string, vars?: Record<string, string>): string {
  let text = translations[lang][key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}
