import { LANG_LABELS, type Lang } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';

const LANGS: Lang[] = ['en', 'fr', 'zh'];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            lang === l
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
