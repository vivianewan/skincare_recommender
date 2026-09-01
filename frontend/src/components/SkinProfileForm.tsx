import { useState } from 'react';
import type { Meta, MetaOption, UserProfile } from '../api';
import { useLanguage } from '../i18n/LanguageContext';
import { CategoryIcon } from '../lib/categoryIcons';

interface Props {
  meta: Meta;
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
}

const BUDGET_TIERS = [
  { value: '', max: undefined, key: 'budget.any' },
  { value: 'value', max: 25, key: 'budget.value' },
  { value: 'mid', max: 60, key: 'budget.mid' },
  { value: 'luxury', max: 150, key: 'budget.luxury' },
] as const;

const AGE_OPTIONS = [
  { id: 'u20', value: 'under-25', key: 'age.u20' },
  { id: '20s', value: '25-35', key: 'age.20s' },
  { id: '30s', value: '35-45', key: 'age.30s' },
  { id: '40s', value: '45+', key: 'age.40s' },
  { id: '50s', value: '45+', key: 'age.50s' },
] as const;

const PREF_KEYS = [
  'pref.fragrance',
  'pref.alcohol',
  'pref.oilfree',
  'pref.clean',
  'pref.vegan',
  'pref.pregnancy',
] as const;

function SectionBadge({ n }: { n: number }) {
  return (
    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center">
      {n}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.2 11.4L3.4 8.6l-1 1 3.8 3.8 7.4-7.4-1-1-6.4 6.4z" />
    </svg>
  );
}

export default function SkinProfileForm({ meta, onSubmit, loading }: Props) {
  const { t } = useLanguage();
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [budgetTier, setBudgetTier] = useState('');
  const [ageId, setAgeId] = useState('');
  const [prefs, setPrefs] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggle = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const selectAllCategories = () => setCategories(meta.categories.map((c) => c.value));
  const selectBasicTrio = () => setCategories(['cleanser', 'serum', 'day_cream']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skinType || categories.length === 0) return;
    const tier = BUDGET_TIERS.find((b) => b.value === budgetTier);
    const ageOpt = AGE_OPTIONS.find((a) => a.id === ageId);
    onSubmit({
      skin_type: skinType,
      concerns,
      categories,
      budget_max: tier?.max,
      fragrance_free: prefs.includes('pref.fragrance'),
      vegan_preferred: prefs.includes('pref.vegan'),
      age_range: ageOpt?.value || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1 — Skin type */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <SectionBadge n={1} />
          <h3 className="text-base font-bold text-gray-900">{t('form.step1')}</h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {meta.skin_types.map((st: MetaOption) => {
            const selected = skinType === st.value;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setSkinType(st.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2 — Concerns */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <SectionBadge n={2} />
            <h3 className="text-base font-bold text-gray-900">{t('form.step2')}</h3>
          </div>
          <span className="text-xs text-gray-400">
            {t('form.multiSelect')} ({concerns.length} {t('form.selected')})
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {meta.concerns.map((c: MetaOption) => {
            const selected = concerns.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggle(concerns, c.value, setConcerns)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selected && <CheckIcon />}
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 — Categories */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <SectionBadge n={3} />
            <h3 className="text-base font-bold text-gray-900">
              {t('form.step3')} <span className="text-accent text-sm font-semibold ml-1">*{t('form.required')}</span>
            </h3>
          </div>
          <div className="flex gap-3 text-xs">
            <button type="button" onClick={selectAllCategories} className="text-gray-500 hover:text-gray-900 underline">
              {t('form.selectAll')}
            </button>
            <button type="button" onClick={selectBasicTrio} className="text-gray-500 hover:text-gray-900 underline">
              {t('form.basicTrio')}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {meta.categories.map((cat: MetaOption) => {
            const selected = categories.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggle(categories, cat.value, setCategories)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${
                  selected
                    ? 'border-accent bg-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    selected ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <CategoryIcon category={cat.value} />
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">{cat.label}</span>
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected ? 'border-accent bg-accent text-white' : 'border-gray-300'
                  }`}
                >
                  {selected && <CheckIcon />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 — Preferences */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <SectionBadge n={4} />
          <h3 className="text-base font-bold text-gray-900">{t('form.step4')}</h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PREF_KEYS.map((key) => {
            const selected = prefs.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(prefs, key, setPrefs)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? 'bg-safe text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selected && <CheckIcon />}
                {t(key)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Budget + Age */}
      <section className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3">{t('form.budgetTier')}</p>
          <div className="flex flex-wrap gap-2">
            {BUDGET_TIERS.map((tier) => (
              <button
                key={tier.value || 'any'}
                type="button"
                onClick={() => setBudgetTier(tier.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  budgetTier === tier.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(tier.key)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3">{t('form.age')}</p>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAgeId(opt.id)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  ageId === opt.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(opt.key)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <p className="text-sm font-bold text-gray-900 mb-3">{t('form.notes')}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('form.notes.placeholder')}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 resize-none"
        />
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={!skinType || categories.length === 0 || loading}
        className="w-full py-4 rounded-full text-white font-semibold text-base tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
        style={{
          background: 'radial-gradient(ellipse at center, #8f2d4a 0%, #3a121f 70%, #1a0a10 100%)',
          boxShadow: '0 4px 20px rgba(107, 31, 54, 0.35)',
        }}
      >
        <svg className="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinejoin="round" />
        </svg>
        {loading ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}
