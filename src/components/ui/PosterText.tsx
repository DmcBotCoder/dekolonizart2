import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import styles from './PosterText.module.css';

interface PosterTextProps {
  poster: 'saveTheDate' | 'theaterGeschichte';
  locale: Locale;
  t: Messages['posterText'];
}

/** The text of a poster as real text (posters are images of text). */
export function PosterText({ poster, locale, t }: PosterTextProps) {
  return (
    <details className={`disclosure ${styles.posterText}`}>
      <summary>
        <span className={styles.icon} aria-hidden="true" />
        {t.summary}
      </summary>
      <div className={styles.body}>
        {poster === 'saveTheDate'
          ? t.std.map((line, i) => {
              // Line 0 is English ("Save the Date"), line 2 the German play title.
              const lang = i === 2 && locale !== 'de' ? 'de' : i === 0 && locale !== 'en' ? 'en' : undefined;
              return (
                <p key={line} lang={lang}>
                  {i === 0 || i === 2 ? <strong>{line}</strong> : line}
                </p>
              );
            })
          : [
              t.tgNote && (
                <p key="note" className={styles.note}>
                  {t.tgNote}
                </p>
              ),
              ...t.tg.map((line, i) => <p key={line}>{i === 0 ? <strong>{line}</strong> : line}</p>),
            ]}
      </div>
    </details>
  );
}
