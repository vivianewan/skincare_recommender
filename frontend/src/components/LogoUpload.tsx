import { useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useLogo } from '../i18n/LogoContext';

export default function LogoUpload() {
  const { t } = useLanguage();
  const { logoUrl, setLogoFromFile, resetLogo } = useLogo();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-300 transition-all flex-shrink-0"
        title={t('logo.upload')}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-white text-lg">
            ✨
          </div>
        )}
        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
          {t('logo.change')}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setLogoFromFile(file);
          e.target.value = '';
        }}
      />
      {logoUrl && (
        <button
          type="button"
          onClick={resetLogo}
          className="text-[10px] text-gray-400 hover:text-gray-600 underline"
        >
          {t('logo.reset')}
        </button>
      )}
    </div>
  );
}
