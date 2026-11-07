'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LOCALE_STORAGE_KEY, localeInfo, locales, localizePath, splitLocale, type Locale } from '@/i18n/config';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  current: Locale;
  label: string;
  /** `compact`: EN DE FR in the header bar. `full`: language names, for the mobile sheet. */
  variant: 'compact' | 'full';
}

/**
 * Keeps the current page and hash, and remembers the choice (a later visit to
 * "/" honours it). Plain <a>: a different language swaps the root layout, so
 * this is a full document load.
 */
export function LanguageSwitcher({ current, label, variant }: LanguageSwitcherProps) {
  const { path } = splitLocale(usePathname());
  const [hash, setHash] = useState('');

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [path]);

  const remember = (code: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <nav className={`${styles.lang} ${styles[variant]}`} aria-label={label}>
      <ul>
        {locales.map((code) => (
          <li key={code}>
            <a
              href={localizePath(path + hash, code)}
              lang={code}
              hrefLang={code}
              aria-current={code === current ? 'true' : undefined}
              onClick={() => remember(code)}
            >
              {variant === 'compact' ? (
                <>
                  <span aria-hidden="true">{localeInfo[code].short}</span>
                  <span className="sr-only">{localeInfo[code].name}</span>
                </>
              ) : (
                localeInfo[code].name
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
