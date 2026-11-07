'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isReducedMotion } from '@/lib/motion';

function focusAfterNavigation() {
  const hash = window.location.hash;
  let target: HTMLElement | null = null;
  if (hash) {
    try {
      target = document.querySelector<HTMLElement>(decodeURIComponent(hash));
    } catch {
      target = null;
    }
  }
  target ??= document.querySelector<HTMLElement>('#main h1') ?? document.getElementById('main');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: !hash });
  if (hash) target.scrollIntoView({ block: 'start' });
}

/**
 * Per-navigation effects, mounted once in the layout:
 *  - releases `[data-reveal]` elements as they enter the viewport (one shared observer)
 *  - after a client-side navigation, moves focus to the page heading (or the hash target)
 *    so keyboard and screen-reader users start at the new content
 *  - plays the `.route-enter` page-entrance animation on <main> (never on the first
 *    load, so LCP is not held back) and closes any header/mobile panel still open
 *    from the previous page (Header and MobileMenu also close themselves on
 *    navigation; this is the safety net for anything left open behind them)
 */
export function RouteEffects() {
  const pathname = usePathname();
  // Compare paths rather than counting renders: effects may run twice for the same page (React strict mode).
  const shownPath = useRef(pathname);

  useEffect(() => {
    (window as { __dkReveal?: boolean }).__dkReveal = true;
    const pending = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
    let observer: IntersectionObserver | undefined;

    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      pending.forEach((el) => el.classList.add('is-in'));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-in');
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
      );
      pending.forEach((el) => observer?.observe(el));
    }

    if (shownPath.current !== pathname) {
      shownPath.current = pathname;

      // Close anything still open from the previous page (native <dialog>s such
      // as the mobile sheet or the poster viewer close themselves on navigation
      // too, but a stray one left open would otherwise trap focus/inertness).
      document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((dialog) => dialog.close());

      const main = document.getElementById('main');
      if (main) {
        main.classList.remove('route-enter');
        // Force a reflow so the class can be re-added to retrigger the animation.
        void main.offsetWidth;
        main.classList.add('route-enter');
      }

      requestAnimationFrame(focusAfterNavigation);
    }

    return () => observer?.disconnect();
  }, [pathname]);

  return null;
}
