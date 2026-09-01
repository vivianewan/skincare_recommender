import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'
import { LogoProvider } from './i18n/LogoContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <LogoProvider>
        <App />
      </LogoProvider>
    </LanguageProvider>
  </StrictMode>,
)
