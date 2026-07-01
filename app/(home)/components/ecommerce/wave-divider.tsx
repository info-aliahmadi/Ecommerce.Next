'use client';

import { useTranslations } from 'next-intl';

export function WaveDivider({ variant = 'default', flip = false, color }: { variant?: 'default' | 'subtle' | 'gradient'; flip?: boolean; color?: string }) {
  const t = useTranslations();
  const height = variant === 'subtle' ? 24 : 40;

  return (
    <div
      className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}
      style={{ height, marginTop: '-1px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        {variant === 'gradient' ? (
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color || '#E63946'} stopOpacity="0.1" />
              <stop offset="50%" stopColor={color || '#6A5ACD'} stopOpacity="0.05" />
              <stop offset="100%" stopColor={color || '#20B2AA'} stopOpacity="0.1" />
            </linearGradient>
          </defs>
        ) : null}
        <path
          d="M0,20 C240,50 480,0 720,25 C960,50 1200,10 1440,30 L1440,60 L0,60 Z"
          fill={variant === 'gradient' ? 'url(#wave-grad)' : 'var(--background)'}
        />
        {variant !== 'subtle' && (
          <path
            d="M0,30 C360,55 720,10 1080,35 C1260,45 1380,25 1440,40 L1440,60 L0,60 Z"
            fill={variant === 'gradient' ? 'url(#wave-grad)' : 'var(--background)'}
            opacity="0.5"
          />
        )}
      </svg>
    </div>
  );
}