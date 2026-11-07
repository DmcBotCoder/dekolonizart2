import Image from 'next/image';
import Link from 'next/link';
import type { EventItem } from '@/content/events';
import styles from './Programme.module.css';

interface ProgrammeRowProps {
  event: EventItem;
  /** Category tag (shown on the "All events" page and the home programme). */
  showCategory?: boolean;
  headingLevel?: 'h2' | 'h3';
}

/**
 * One line of the season programme: date, what & where, the two separate
 * actions (book / information) and the poster. Works in server and client
 * components (the events search renders it too).
 */
export function ProgrammeRow({ event, showCategory = true, headingLevel = 'h3' }: ProgrammeRowProps) {
  const Heading = headingLevel;
  return (
    <article className={styles.row} aria-labelledby={`ev-${event.id}`}>
      <p className={styles.when}>{event.when}</p>
      <div className={styles.body}>
        {showCategory && <p className={styles.category}>{event.categoryLabel}</p>}
        <Heading id={`ev-${event.id}`} className={styles.title} lang={event.titleLang}>
          {event.title}
        </Heading>
        {event.subtitle && <p className={styles.subtitle}>{event.subtitle}</p>}
        <p className={styles.text}>{event.text}</p>
        {event.place && <p className={styles.place}>{event.place}</p>}
        <div className={`actions ${styles.actions}`}>
          <Link href={event.primary.href} className={event.primary.kind === 'booking' ? 'ticket' : 'btn'}>
            {event.primary.label}
            <span className="sr-only">: {event.title}</span>
          </Link>
          <Link href={event.secondary.href} className="btn-line">
            {event.secondary.label}
            <span className="sr-only">: {event.title}</span>
          </Link>
        </div>
      </div>
      <div className={styles.media} aria-hidden="true">
        {event.image ? (
          <Image src={event.image.src} alt="" width={event.image.width} height={event.image.height} sizes="(min-width: 1024px) 22vw, 30vw" />
        ) : (
          <span className={styles.noImage}>{event.title.slice(0, 1)}</span>
        )}
      </div>
    </article>
  );
}

/** A list of programme rows. */
export function Programme({ events, showCategory, headingLevel }: { events: EventItem[]; showCategory?: boolean; headingLevel?: 'h2' | 'h3' }) {
  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.id}>
          <ProgrammeRow event={event} showCategory={showCategory} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
