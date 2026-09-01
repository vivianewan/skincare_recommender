import { useEffect, useState } from 'react';
import {
  fetchMeta,
  getRecommendations,
  isStaticMode,
  refreshProductData,
  type Meta,
  type RecommendationResponse,
  type UserProfile,
} from './api';
import { useLanguage } from './i18n/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import LogoUpload from './components/LogoUpload';
import SkinProfileForm from './components/SkinProfileForm';
import RecommendationResults from './components/RecommendationResults';

function App() {
  const { lang, t } = useLanguage();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'results'>('form');

  useEffect(() => {
    setMeta(null);
    fetchMeta(lang)
      .then(setMeta)
      .catch(() => setError(t('error.backend')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendations(profile, lang);
      setResults(data);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(t('error.recommend'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProductData();
    } catch {
      setError(t('error.refresh'));
    } finally {
      setRefreshing(false);
    }
  };

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f5]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{error || t('app.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f5]">
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <LogoUpload />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight truncate">
                {t('app.title')}
              </h1>
              <p className="text-xs text-gray-500 truncate">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isStaticMode && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="hidden sm:block text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                {refreshing ? t('app.refreshing') : t('app.refresh')}
              </button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8">
        {step === 'form' ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('app.hero.title')}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{t('app.hero.desc')}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <SkinProfileForm meta={meta} onSubmit={handleSubmit} loading={loading} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('app.results.title')}</h2>
                <p className="text-gray-500 text-sm mt-1">{t('app.results.subtitle')}</p>
              </div>
              <button
                onClick={() => {
                  setStep('form');
                  setResults(null);
                }}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 flex-shrink-0"
              >
                {t('app.back')}
              </button>
            </div>

            {results && (
              <RecommendationResults
                recommendations={results.recommendations}
                categoryLabels={Object.fromEntries(
                  meta.categories.map((c) => [c.value, c.label]),
                )}
              />
            )}
          </>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-gray-400">{t('app.footer')}</footer>
    </div>
  );
}

export default App;
