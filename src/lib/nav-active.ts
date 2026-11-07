/**
 * Current-section rule for the navigation: an item is active on its own page,
 * on any page below it (e.g. /events/<slug>) and on the pages of its submenu.
 * Home is only active on "/".
 */
export function isNavItemActive(item: { href: string; children?: { href: string }[] }, path: string): boolean {
  if (item.href === '/') return path === '/';
  if (path === item.href || path.startsWith(`${item.href}/`)) return true;
  return item.children?.some((child) => path === child.href) ?? false;
}
