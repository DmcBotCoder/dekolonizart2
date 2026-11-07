import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LightboxImage } from '@/components/ui/Lightbox';
import { PosterButton } from '@/components/ui/PosterButton';
import { Facts, type Fact } from './Facts';
import styles from './Spotlight.module.css';

interface SpotlightProps {
  id?: string;
  kicker: ReactNode;
  /** The title block (h2 content). */
  title: ReactNode;
  titleLang?: string;
  /** Original-language subtitle (rendered in the record voice) and its translation. */
  subtitle?: { text: string; lang?: string; translation?: string };
  lead?: ReactNode;
  /** Large date numerals, e.g. ['13', '12', '26'] with its spoken form. */
  date?: { parts: string[]; label: string };
  facts?: Fact[];
  /** Custom detail block instead of (or after) the facts. */
  details?: ReactNode;
  primary: { href: string; label: string; srLabel?: string; kind: 'booking' | 'signup' };
  secondary?: { href: string; label: string; srLabel?: string };
  credit?: ReactNode;
  poster: { image: LightboxImage; label: string; zoom: string; text?: ReactNode };
  /** Poster on the right instead of the left. */
  flip?: boolean;
  priority?: boolean;
}

/**
 * A production or project in the spotlight, composed like a playbill spread:
 * the poster (zoomable) on one side; title, the date in large numerals, the
 * facts and the two separate actions on the other.
 */
export function Spotlight({ id, kicker, title, titleLang, subtitle, lead, date, facts, details, primary, secondary, credit, poster, flip, priority }: SpotlightProps) {
  return (
    <div className={`${styles.spotlight} ${flip ? styles.flip : ''}`}>
      <div className={styles.posterCol}>
        <div data-reveal="rise">
          <PosterButton image={poster.image} label={poster.label} zoomLabel={poster.zoom} sizes="(min-width: 1024px) 30vw, 80vw" priority={priority} />
        </div>
        {poster.text}
      </div>
      <div className={styles.text}>
        <p className={styles.kicker}>{kicker}</p>
        <h2 id={id} className={styles.title} lang={titleLang}>
          {title}
        </h2>
        {subtitle && (
          <p className={styles.subtitle}>
            <span lang={subtitle.lang}>{subtitle.text}</span>
            {subtitle.translation && <span className={styles.translation}>{subtitle.translation}</span>}
          </p>
        )}
        {lead && <p className={`lead ${styles.lead}`}>{lead}</p>}
        {date && (
          <p className={styles.date} role="img" aria-label={date.label}>
            {date.parts.map((part, i) => (
              <span key={i}>{part}</span>
            ))}
          </p>
        )}
        {facts && <Facts items={facts} />}
        {details}
        <div className={`actions ${styles.actions}`}>
          <Link href={primary.href} className={primary.kind === 'booking' ? 'ticket' : 'btn'}>
            {primary.label}
            {primary.srLabel && <span className="sr-only">{primary.srLabel}</span>}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-line">
              {secondary.label}
              {secondary.srLabel && <span className="sr-only">{secondary.srLabel}</span>}
            </Link>
          )}
        </div>
        {credit && <p className={styles.credit}>{credit}</p>}
      </div>
    </div>
  );
}
