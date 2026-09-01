import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'skincare-custom-logo';

interface LogoContextValue {
  logoUrl: string | null;
  setLogoFromFile: (file: File) => void;
  resetLogo: () => void;
}

const LogoContext = createContext<LogoContextValue | null>(null);

function applyFavicon(dataUrl: string | null) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (dataUrl) {
    link.href = dataUrl;
  } else {
    link.href = `${import.meta.env.BASE_URL}favicon.svg`;
  }
}

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    applyFavicon(logoUrl);
  }, [logoUrl]);

  const setLogoFromFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(STORAGE_KEY, dataUrl);
      setLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const resetLogo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLogoUrl(null);
  }, []);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoFromFile, resetLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const ctx = useContext(LogoContext);
  if (!ctx) throw new Error('useLogo must be used within LogoProvider');
  return ctx;
}
