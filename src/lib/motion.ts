/** localStorage key of the in-site "Reduce motion" switch. */
export const REDUCE_MOTION_KEY = 'dk-reduce-motion';

let cache: boolean | null = null;

/**
 * Motion is off when the visitor asked for it: the in-site switch (stored)
 * wins, otherwise the OS setting. The boot script applies the same rule
 * before first paint (`html.reduce-motion`).
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (cache === null) {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(REDUCE_MOTION_KEY);
    } catch {
      /* storage unavailable */
    }
    cache = stored === '1' || (stored !== '0' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  return cache;
}

export function setReducedMotion(on: boolean) {
  try {
    localStorage.setItem(REDUCE_MOTION_KEY, on ? '1' : '0');
  } catch {
    /* storage unavailable – the reload still applies the OS default */
  }
  location.reload();
}

/** For `useSyncExternalStore`: the flag only changes through a reload. */
export const subscribeNever = () => () => {};
export const reducedMotionServerSnapshot = () => false;
