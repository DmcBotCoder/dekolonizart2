'use client';

import Link from 'next/link';
import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import {
  defaultA11ySettings,
  getA11yServerSnapshot,
  getA11ySnapshot,
  isDefaultA11y,
  subscribeA11y,
  updateA11ySettings,
  type A11yToggle,
  type TextSize,
} from '@/lib/a11y-settings';
import { isReducedMotion, reducedMotionServerSnapshot, setReducedMotion, subscribeNever } from '@/lib/motion';
import styles from './A11yPanel.module.css';

const SIZES: TextSize[] = [100, 125, 150];
const TOGGLES: A11yToggle[] = ['contrast', 'readableFont', 'spacing', 'underline'];

/**
 * Accessibility settings in a native popover (top layer, Escape and outside
 * click close it, focus returns to the button). Settings are stored on the
 * device and applied before first paint by the boot script.
 */
export function A11yPanel({ locale, t }: { locale: Locale; t: Messages['a11y'] }) {
  const settings = useSyncExternalStore(subscribeA11y, getA11ySnapshot, getA11yServerSnapshot);
  const reduced = useSyncExternalStore(subscribeNever, isReducedMotion, reducedMotionServerSnapshot);
  const [said, setSaid] = useState('');
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const id = useId();
  const panelId = `${id}-a11y`;

  const announce = (text: string) => {
    setSaid('');
    requestAnimationFrame(() => setSaid(text));
  };

  const custom = !isDefaultA11y(settings) || reduced;

  return (
    <>
      <button type="button" className={styles.button} popoverTarget={panelId} aria-expanded={open} title={t.button}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M4 8.5c2.7.8 5.3 1.2 8 1.2s5.3-.4 8-1.2M12 9.7v4.6m0 0-3 6.2m3-6.2 3 6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">
          {t.button}
          {custom ? ` ${t.custom}` : ''}
        </span>
        {custom && <span className={styles.badge} aria-hidden="true" />}
      </button>

      <section
        ref={panel}
        id={panelId}
        popover="auto"
        className={styles.panel}
        aria-labelledby={`${id}-title`}
        onToggle={(event) => {
          const isOpen = (event as unknown as ToggleEvent).newState === 'open';
          setOpen(isOpen);
          if (isOpen) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('input:checked')?.focus());
        }}
      >
        <div className={styles.head}>
          <h2 id={`${id}-title`}>{t.title}</h2>
          <button type="button" className={styles.close} popoverTarget={panelId} popoverTargetAction="hide">
            <span className="sr-only">{t.close}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <p className={styles.hint}>{t.hint}</p>

        <fieldset className={styles.sizes}>
          <legend>{t.textSize}</legend>
          <div className={styles.seg}>
            {SIZES.map((size) => (
              <label key={size}>
                <input
                  type="radio"
                  name={`${id}-size`}
                  value={size}
                  checked={settings.textSize === size}
                  onChange={() => {
                    updateA11ySettings({ ...settings, textSize: size });
                    announce(t.sizeSaid.replace('{n}', String(size)));
                  }}
                />
                <span aria-hidden="true" style={{ fontSize: `${0.85 + (size - 100) / 200}rem` }}>
                  A
                </span>
                <span className={styles.pct}>{size} %</span>
              </label>
            ))}
          </div>
        </fieldset>

        <ul className={styles.switches}>
          {TOGGLES.map((key) => (
            <li key={key}>
              <button
                type="button"
                role="switch"
                aria-checked={settings[key]}
                onClick={() => {
                  const value = !settings[key];
                  updateA11ySettings({ ...settings, [key]: value });
                  announce(`${t[key].label} ${value ? t.on : t.off}`);
                }}
              >
                <span>
                  <strong>{t[key].label}</strong>
                  <small>{t[key].desc}</small>
                </span>
                <span className={styles.track} aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" role="switch" aria-checked={reduced} onClick={() => setReducedMotion(!reduced)}>
              <span>
                <strong>{t.motion.label}</strong>
                <small>{t.motion.desc}</small>
              </span>
              <span className={styles.track} aria-hidden="true" />
            </button>
          </li>
        </ul>

        <ul className={styles.more}>
          {(
            [
              ['/easy-read', t.easy],
              ['/glossary', t.glossary],
              ['/accessibility', t.statement],
            ] as const
          ).map(([href, label]) => (
            <li key={href}>
              <Link href={localizePath(href, locale)} onClick={() => panel.current?.hidePopover()}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            updateA11ySettings({ ...defaultA11ySettings });
            announce(t.resetSaid);
            if (reduced) setReducedMotion(false);
          }}
        >
          {t.reset}
        </button>
        <p className="sr-only" role="status" aria-live="polite">
          {said}
        </p>
      </section>
    </>
  );
}
