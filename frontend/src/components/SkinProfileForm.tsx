import { useState } from 'react';
import type { Meta, MetaOption, UserProfile } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  meta: Meta;
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
}

export default function SkinProfileForm({ meta, onSubmit, loading }: Props) {
  const { t } = useLanguage();
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [budgetMax, setBudgetMax] = useState<number | ''>('');
  const [fragranceFree, setFragranceFree] = useState(false);
  const [ageRange, setAgeRange] = useState('');

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skinType) return;
    onSubmit({
      skin_type: skinType,
      concerns,
      categories: categories.length > 0 ? categories : meta.categories.map((c: MetaOption) => c.value),
      budget_max: budgetMax || undefined,
      fragrance_free: fragranceFree,
      vegan_preferred: false,
      age_range: ageRange || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">1</span>
          {t('form.step1')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {meta.skin_types.map((st: MetaOption) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setSkinType(st.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                skinType === st.value
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:bg-brand-50/50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">2</span>
          {t('form.step2')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {meta.concerns.map((c: MetaOption) => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleItem(concerns, c.value, setConcerns)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                concerns.includes(c.value)
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">3</span>
          {t('form.step3')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {meta.categories.map((cat: MetaOption) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleItem(categories, cat.value, setCategories)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                categories.includes(cat.value)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.budget')}</label>
          <input
            type="number"
            min={0}
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
            placeholder={t('form.budget.placeholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.age')}</label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none bg-white"
          >
            {meta.age_ranges.map((opt) => (
              <option key={opt.value || 'any'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={fragranceFree}
          onChange={(e) => setFragranceFree(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
        />
        <span className="text-sm text-gray-700">{t('form.fragrance')}</span>
      </label>

      <button
        type="submit"
        disabled={!skinType || loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:from-brand-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}
