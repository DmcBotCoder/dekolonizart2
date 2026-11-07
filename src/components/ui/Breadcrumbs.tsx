import Link from 'next/link';
import type { Crumb } from '@/lib/breadcrumbs';
import styles from './Breadcrumbs.module.css';

/** Trail to the current page (localized hrefs); the current page closes it. */
export function Breadcrumbs({ label, crumbs, current, className }: { label: string; crumbs: Crumb[]; current: string; className?: string }) {
  return (
    <nav className={`${styles.crumbs} ${className ?? ''}`} aria-label={label}>
      <ol>
        {crumbs.map((crumb) => (
          <li key={crumb.href}>
            <Link href={crumb.href}>{crumb.label}</Link>
          </li>
        ))}
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
