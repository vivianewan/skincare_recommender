import type { ReactNode } from 'react';

const iconClass = 'w-5 h-5';

export const CATEGORY_ICONS: Record<string, ReactNode> = {
  cleanser: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
      <path d="M5 16c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
  ),
  toner: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2.5c2 3 4 5.5 4 8.5a4 4 0 01-8 0c0-3 2-5.5 4-8.5z" />
    </svg>
  ),
  serum: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M12 7v3M10 18h4M9 10h6l-1 8H10l-1-8z" strokeLinecap="round" />
    </svg>
  ),
  day_cream: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" strokeLinecap="round" />
    </svg>
  ),
  night_cream: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 14.5A8.5 8.5 0 1112 6c0 3.5 2 6.5 4.5 8.5" strokeLinecap="round" />
    </svg>
  ),
  eye_cream: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  sunscreen: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 4v6c0 4.5-3.5 8-7 8s-7-3.5-7-8V7l7-4z" strokeLinejoin="round" />
    </svg>
  ),
  mask: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 10.5h.01M15.5 10.5h.01M8.5 15c1.2 1.5 2.5 2 3.5 2s2.3-.5 3.5-2" strokeLinecap="round" />
    </svg>
  ),
};

export function CategoryIcon({ category }: { category: string }) {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.serum;
}
