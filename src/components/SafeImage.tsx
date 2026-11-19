import React, { useEffect, useState } from 'react';
import { ThemeMode } from '../types';
import { getAuthToken } from '../utils/api';
import heroSeedImg from '../assets/images/hero_keepsake_portrait_1794854280491.jpg';
import sparkSeedImg from '../assets/images/memory_first_spark_1794854280008.jpg';
import coastalSeedImg from '../assets/images/memory_coastal_dusk_1794854279401.jpg';
import picnicSeedImg from '../assets/images/memory_starry_picnic_1794854280595.jpg';
import rainySeedImg from '../assets/images/memory_rainy_morning_1794854281337.jpg';

const SEED_FALLBACK_IMPORTS: Record<string, string> = {
  '/api/seed-asset/hero': heroSeedImg,
  '/api/seed-asset/spark': sparkSeedImg,
  '/api/seed-asset/coastal': coastalSeedImg,
  '/api/seed-asset/picnic': picnicSeedImg,
  '/api/seed-asset/rainy': rainySeedImg,
};

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  theme?: ThemeMode;
  loading?: 'eager' | 'lazy';
  placeholderTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  theme = 'romantic',
  loading = 'lazy',
  placeholderTitle = 'Srishti & Manav',
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    setHasError(false);

    if (!src || !src.trim()) {
      setResolvedSrc('');
      return;
    }

    if (SEED_FALLBACK_IMPORTS[src]) {
      setResolvedSrc(SEED_FALLBACK_IMPORTS[src]);
      return;
    }

    if (src.startsWith('/api/media/')) {
      const token = getAuthToken();
      fetch(src, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Unauthorized or missing media');
          return res.blob();
        })
        .then((blob) => {
          if (!active) return;
          objectUrl = URL.createObjectURL(blob);
          setResolvedSrc(objectUrl);
        })
        .catch(() => {
          if (active) setHasError(true);
        });
    } else {
      setResolvedSrc(src);
    }

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  const isAquatic = theme === 'aquatic';

  if (!resolvedSrc || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center select-none ${
          isAquatic
            ? 'bg-gradient-to-br from-[#e0fbfc] via-[#caf0f8] to-[#bde0fe] text-[#03045e]'
            : 'bg-gradient-to-br from-[#FFF9F2] via-[#FCE7F3] to-[#EDE9FE] text-[#BE185D]'
        } ${className}`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-xs ${
            isAquatic ? 'bg-white/80 text-[#0077B6]' : 'bg-white/85 text-[#EC4899]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {isAquatic ? 'waves' : 'favorite'}
          </span>
        </div>
        <p className="font-serif text-base font-semibold leading-snug">{placeholderTitle}</p>
        <p className="text-[11px] opacity-75 mt-1">Upload a cherished photo anytime</p>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
