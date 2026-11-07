import { findNavParent } from '@/content/navigation';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';

export interface Crumb {
  href: string;
  label: string;
}

/**
 * Home → (menu parent, if the page sits in a dropdown) → extra ancestors.
 * The current page is appended by the page header.
 */
export function buildCrumbs(path: string, locale: Locale, t: Messages, extra: Crumb[] = []): Crumb[] {
  const crumbs: Crumb[] = [{ href: localizePath('/', locale), label: t.nav.home.label }];
  const parent = findNavParent(path);
  if (parent) crumbs.push({ href: localizePath(parent.href, locale), label: (t.nav[parent.id] as { label: string }).label });
  extra.forEach((crumb) => crumbs.push({ href: localizePath(crumb.href, locale), label: crumb.label }));
  return crumbs;
}
