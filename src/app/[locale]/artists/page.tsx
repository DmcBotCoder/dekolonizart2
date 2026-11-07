import type { Metadata } from 'next';
import Image from 'next/image';
import { Initials } from '@/components/people/Initials';
import { PageHeader } from '@/components/ui/PageHeader';
import { ReadMore } from '@/components/ui/ReadMore';
import { artists } from '@/content/artists';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './artists.module.css';

const PATH = '/artists';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.artists, description: t.artists.eyebrow });
}

/**
 * Artists, one editorial profile each. Every profile is addressable as
 * /artists#<slug> (stable slug, never a list position); the linked profile
 * is focused and marked when someone arrives from a cast list.
 */
export default async function ArtistsPage() {
  const { locale, t } = await getI18n();

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t, [{ href: '/theater', label: t.nav.theater.label }])}
        current={t.meta.titles.artists}
        kicker={t.artists.eyebrow}
        title={t.artists.title}
      />
      <section className="section">
        <div className="container">
          {artists.map((artist, i) => {
            const bioLang = artist.bio && artist.bio.lang !== locale ? artist.bio.lang : undefined;
            return (
              <article
                key={artist.slug}
                id={artist.slug}
                className={`${styles.artist} ${i % 2 ? styles.flip : ''} ${artist.photo ? '' : styles.noPhoto}`}
                tabIndex={-1}
                aria-labelledby={`${artist.slug}-name`}
              >
                <div className={styles.frame}>
                  {artist.photo ? (
                    <Image
                      src={artist.photo.src}
                      alt={format(t.team.portraitOf, { name: artist.name })}
                      width={artist.photo.width}
                      height={artist.photo.height}
                      sizes="(min-width: 1024px) 34vw, 100vw"
                    />
                  ) : (
                    <Initials name={artist.name} size="l" />
                  )}
                </div>
                <div className={styles.text}>
                  <p className={styles.role}>{t.artists.roles[artist.role]}</p>
                  <h2 id={`${artist.slug}-name`} className={styles.name}>
                    {artist.name}
                  </h2>
                  {artist.location && <p className={styles.location}>{artist.location}</p>}
                  {artist.bio && (
                    <div className={styles.bio}>
                      {bioLang && <p className={styles.langNote}>{t.common.onlyGerman}</p>}
                      <ReadMore
                        blocks={artist.bio.paragraphs.map((text) => ({ kind: 'p' as const, text }))}
                        lang={bioLang}
                        labels={{ more: t.common.readMore, less: t.common.readLess }}
                      />
                    </div>
                  )}
                  {artist.website && (
                    <a href={artist.website} className="textlink" target="_blank" rel="noopener">
                      {format(t.artists.website, { name: artist.name.split(' ')[0] })}
                      <span className="sr-only"> {t.common.newTab}</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
