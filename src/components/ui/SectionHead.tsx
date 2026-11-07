import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './SectionHead.module.css';

interface SectionHeadProps {
  id?: string;
  kicker?: ReactNode;
  title: ReactNode;
  titleLang?: string;
  /** Optional link aligned with the title (e.g. "View all events"). */
  link?: { href: string; label: string };
  className?: string;
}

/** Section title in the stage voice, with an optional kicker and a link on the same baseline. */
export function SectionHead({ id, kicker, title, titleLang, link, className }: SectionHeadProps) {
  return (
    <div className={`${styles.head} ${className ?? ''}`}>
      <div className={styles.titles}>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <h2 id={id} lang={titleLang}>
          {title}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="textlink">
          {link.label}
        </Link>
      )}
    </div>
  );
}
