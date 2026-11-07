'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ResolvedNavItem } from '@/content/navigation';
import { localizePath, splitLocale, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { isNavItemActive } from '@/lib/nav-active';
import { A11yPanel } from './A11yPanel';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

export interface HeaderLabels {
  homeLink: string;
  mainNav: string;
  mobileNav: string;
  submenu: string;
  menu: string;
  close: string;
  donation: string;
  newTab: string;
  language: string;
  overview: string;
  follow: string;
}

interface HeaderProps {
  locale: Locale;
  nav: ResolvedNavItem[];
  socials: readonly { label: string; href: string }[];
  email: string;
  a11y: Messages['a11y'];
  labels: HeaderLabels;
}

/** Current-section rule (see `lib/nav-active.ts`). */
export const isActive = (item: ResolvedNavItem, path: string) => isNavItemActive(item, path);

export function Header({ locale, nav, socials, email, a11y, labels }: HeaderProps) {
  const { path } = splitLocale(usePathname());
  const l = (href: string) => localizePath(href, locale);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const baseId = useId();

  const close = useCallback((returnFocus = false) => {
    setOpenIndex((index) => {
      if (returnFocus && index !== null) {
        headerRef.current?.querySelector<HTMLButtonElement>(`[data-panel-button="${index}"]`)?.focus();
      }
      return null;
    });
  }, []);

  /* Close panels on navigation. */
  useEffect(() => {
    close();
  }, [path, close]);

  /* Escape, click outside, focus leaving the header. */
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    const onFocus = (event: FocusEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onFocus);
    };
  }, [openIndex, close]);

  /* Hide while scrolling down, show again on the way up. */
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 160);
          last = y;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Mouse users can open panels by hovering (with a short intent delay); touch and keyboard use the button. */
  const hoverOpen = (index: number) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenIndex(index), 120);
  };
  const hoverClose = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenIndex(null), 260);
  };

  const isHidden = hidden && openIndex === null;

  return (
    <header
      ref={headerRef}
      className={`surface-stage ${styles.header} ${isHidden ? styles.hidden : ''}`}
      data-site-header=""
      onFocus={() => setHidden(false)}
    >
      <div className={`container ${styles.bar}`}>
        <Link href={l('/')} className={styles.brand} aria-label={labels.homeLink} aria-current={path === '/' ? 'page' : undefined}>
          <span className={styles.mark}>
            <Image src="/img/logo.png" alt="" width={44} height={44} priority />
          </span>
          <span className={styles.word} aria-hidden="true">
            DekolonizArt
          </span>
        </Link>

        <nav className={styles.nav} aria-label={labels.mainNav}>
          <ul className={styles.list}>
            {nav.map((item, index) => {
              const active = isActive(item, path);
              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={l(item.href)}
                      className={`${styles.item} ${active ? styles.active : ''}`}
                      aria-current={path === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const open = openIndex === index;
              const panelId = `${baseId}-panel-${index}`;
              return (
                <li key={item.href} onMouseEnter={() => hoverOpen(index)} onMouseLeave={hoverClose}>
                  <button
                    type="button"
                    className={`${styles.item} ${active ? styles.active : ''}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    data-panel-button={index}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.label}
                    <svg className={styles.chev} width="11" height="11" viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                  <div id={panelId} className={`surface-deep ${styles.panel} ${open ? styles.panelOpen : ''}`} inert={!open}>
                    <div className={`container ${styles.panelGrid}`}>
                      <Link href={l(item.href)} className={styles.panelTitle} aria-current={path === item.href ? 'page' : undefined}>
                        <span className={styles.panelKicker}>{labels.overview}</span>
                        {item.label}
                      </Link>
                      <ul className={styles.children} aria-label={labels.submenu.replace('{label}', item.label)}>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={l(child.href)} aria-current={path === child.href ? 'page' : undefined} className={styles.child}>
                              <span className={styles.childLabel}>{child.label}</span>
                              <span className={styles.childText}>{child.text}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {item.feature && (
                        <Link href={l(item.feature.href)} className={styles.feature}>
                          <span className={styles.featureKicker}>{item.feature.kicker}</span>
                          <span className={styles.featureTitle}>{item.feature.title}</span>
                          <span className={styles.featureText}>{item.feature.text}</span>
                          <span className={styles.featureCta}>{item.feature.cta}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.tools}>
          <div className={styles.langDesktop}>
            <LanguageSwitcher current={locale} label={labels.language} variant="compact" />
          </div>
          <A11yPanel locale={locale} t={a11y} />
          <Link href={l('/#support')} className={`btn ${styles.donate}`}>
            {labels.donation}
          </Link>
          <MobileMenu locale={locale} nav={nav} path={path} socials={socials} email={email} labels={labels} />
        </div>
      </div>
    </header>
  );
}
