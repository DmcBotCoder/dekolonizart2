import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CurtainImage } from '@/components/ui/CurtainImage';
import { heroImages, workshopBand } from '@/content/media';
import { splitLastWord } from '@/lib/text';
import styles from './Hero.module.css';

interface HeroProps {
  eyebrow: string;
  /** `home.h1a` / `home.h1b` — the last word of each line is set apart. */
  lines: [string, string];
  actions: { primary: { href: string; label: string }; secondary: { href: string; label: string } };
  next: {
    label: string;
    date: string;
    title: string;
    production?: string;
    /** `lang` of the production's (German) short title when the page is not German. */
    productionLang?: string;
    venue: string;
    href: string;
    cta: string;
  };
}

/*
 * Average advance width (in em) of one character of each key word, measured in
 * Movement (an all-caps face) at the weights used in Hero.module.css, with a
 * little headroom: past @230 → 0.495–0.57 (en/de/fr), future @860 → 0.618–0.636.
 * The *_PAD terms are each strip's side padding, plus the lime strip's tilt.
 * Same idea as version 2's `titleEms`: the headline's font size is chosen so
 * the widest key word always fills, but never overflows, its column — in
 * every language.
 */
const PAST_EM = 0.59;
const PAST_PAD = 0.1;
const FUTURE_EM = 0.65;
const FUTURE_PAD = 0.36;

/**
 * The collage: three archival-feeling photographs, each in its own torn-paper
 * frame, tilted and overlapping. All decorative (the headline carries the meaning).
 * `delay` staggers both the frame's tear (CurtainImage) and the piece settling
 * into place (Hero.module.css), via the inherited `--delay` property.
 */
const pieces = [
  { id: 'stage', image: heroImages.melilla, sizes: '(min-width: 1024px) 50vw, 92vw', delay: 0, priority: true },
  { id: 'archive', image: heroImages.doualaMangaBell, sizes: '(min-width: 1024px) 22vw, 44vw', delay: 200, priority: false },
  { id: 'workshop', image: { ...workshopBand, position: '47% 60%' }, sizes: '(min-width: 1024px) 38vw, 66vw', delay: 400, priority: false },
] as const;

/**
 * Home page opening ("Torn Archive"): an oversized headline pasted over a torn
 * photo collage, with the next performance pinned on like a ticket stub. Also
 * owns the torn boundary into the section that follows — give that section
 * `heroNext` (see Hero.module.css, "The tear").
 */
export function Hero({ eyebrow, lines, actions, next }: HeroProps) {
  const [pastLead, pastWord] = splitLastWord(lines[0]);
  const [futureLead, futureWord] = splitLastWord(lines[1]);
  // Size the headline so the widest key word always fits its column, in every language.
  const titleEms = Math.max(pastWord.length * PAST_EM + PAST_PAD, futureWord.length * FUTURE_EM + FUTURE_PAD);

  return (
    <section className={`surface-stage ${styles.hero}`} aria-labelledby="home-title">
      <div className={`container ${styles.grid}`}>
        <p className={styles.eyebrow}>{eyebrow}</p>

        <div className={styles.collage}>
          {pieces.map((piece) => (
            <div key={piece.id} className={`${styles.piece} ${styles[piece.id]}`} style={{ '--delay': `${piece.delay}ms` } as CSSProperties}>
              <CurtainImage className={styles.frame} image={piece.image} sizes={piece.sizes} priority={piece.priority} />
            </div>
          ))}
        </div>

        <div className={styles.title}>
          <h1 id="home-title" className={styles.headline} style={{ '--title-ems': titleEms } as CSSProperties}>
            <span className={styles.lead1}>{pastLead}</span> <span className={styles.past}>{pastWord}</span>{' '}
            <span className={styles.lead2}>{futureLead}</span> <span className={styles.future}>{futureWord}</span>
          </h1>
        </div>

        <div className={`actions ${styles.actions}`}>
          <Link href={actions.primary.href} className="btn">
            {actions.primary.label}
          </Link>
          <Link href={actions.secondary.href} className="btn-line">
            {actions.secondary.label}
          </Link>
        </div>

        <div className={styles.next} role="group" aria-labelledby="next-title">
          <p className={styles.nextLabel}>{next.label}</p>
          <p className={styles.nextDate}>{next.date}</p>
          <div className={styles.nextWhat}>
            <h2 id="next-title" className={styles.nextTitle}>
              {next.title}
            </h2>
            <p lang={next.productionLang}>{next.production}</p>
            <p className={styles.nextPlace}>{next.venue}</p>
          </div>
          <Link href={next.href} className={`ticket ${styles.nextCta}`}>
            {next.cta}
            <span className="sr-only">: {next.production}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Class for the section right after the hero: it slides under the hero's torn edge. */
export const heroNext = styles.heroNext;
