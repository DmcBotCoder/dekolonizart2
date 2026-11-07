'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { ResolvedNavItem } from '@/content/navigation';
import { localizePath, type Locale } from '@/i18n/config';
import type { HeaderLabels } from './Header';
import { isActive } from './Header';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  locale: Locale;
  nav: ResolvedNavItem[];
  path: string;
  socials: readonly { label: string; href: string }[];
  email: string;
  labels: HeaderLabels;
}

/**
 * Phones and tablets: a full-screen programme sheet in a native modal
 * <dialog> (focus stays inside, Escape closes, the page behind is inert).
 * Sections with sub-pages are accordions; the section containing the current
 * page starts open.
 */
export function MobileMenu({ locale, nav, path, socials, email, labels }: MobileMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const l = (href: string) => localizePath(href, locale);

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
  };
  const hide = () => dialog.current?.close();

  /* Any navigation closes the sheet. */
  useEffect(() => {
    hide();
  }, [path]);

  /* Back to desktop width: never leave a modal open behind the desktop navigation. */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1180px)');
    const onChange = () => query.matches && hide();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <button type="button" className={styles.toggle} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={show}>
        <span className={styles.bars} aria-hidden="true" />
        {labels.menu}
      </button>

      <dialog
        ref={dialog}
        id={id}
        className={`surface-deep ${styles.sheet}`}
        aria-label={labels.mobileNav}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // A link inside the sheet: close it (same-page hash links included).
          if ((event.target as Element).closest('a')) hide();
        }}
      >
        <div className={styles.inner}>
          <div className={styles.top}>
            <Link href={l('/')} className={styles.brand}>
              DekolonizArt
            </Link>
            <button type="button" className={styles.close} onClick={hide}>
              {labels.close}
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav aria-label={labels.mobileNav}>
            <ul className={styles.list}>
              {nav.map((item) => {
                const active = isActive(item, path);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={l(item.href)}
                        className={`${styles.link} ${active ? styles.active : ''}`}
                        aria-current={path === item.href ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <details className={styles.group} name="mobile-nav" open={active}>
                      <summary className={`${styles.link} ${active ? styles.active : ''}`}>
                        {item.label}
                        <span className={styles.plus} aria-hidden="true" />
                      </summary>
                      <ul className={styles.sub} aria-label={labels.submenu.replace('{label}', item.label)}>
                        {item.href !== item.children[0]?.href && (
                          <li>
                            <Link href={l(item.href)} aria-current={path === item.href ? 'page' : undefined}>
                              <span className={styles.subLabel}>{labels.overview}</span>
                            </Link>
                          </li>
                        )}
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={l(child.href)} aria-current={path === child.href ? 'page' : undefined}>
                              <span className={styles.subLabel}>{child.label}</span>
                              <span className={styles.subText}>{child.text}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.foot}>
            <LanguageSwitcher current={locale} label={labels.language} variant="full" />
            <Link href={l('/support')} className={`btn ${styles.donate}`}>
              {labels.donation}
            </Link>
            <a className={styles.mail} href={`mailto:${email}`}>
              {email}
            </a>
            <ul className={styles.socials} aria-label={labels.follow}>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener">
                    {social.label}
                    <span className="sr-only"> {labels.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
