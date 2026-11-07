import type { Metadata } from 'next';
import { VibetixEmbed } from '@/components/events/VibetixEmbed';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHead } from '@/components/ui/SectionHead';
import { vibetixEventListEmbed } from '@/content/productions';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';

const PATH = '/events';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.events, description: t.allEvents.title });
}

/** All events – theatre, workshops, movement & dance – searchable and filterable. */
export default async function EventsPage() {
  const { locale, t } = await getI18n();
  const e = t.allEvents;

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.events}
        kicker={e.eyebrow}
        title={e.title}
      />
      <section className="section-tight" aria-labelledby="vibetix-events-title">
        <div className="container">
          <SectionHead id="vibetix-events-title" title={e.vibetixH} />
          <p className="lead">{e.vibetixP}</p>
          <VibetixEmbed
            embedId={vibetixEventListEmbed.embedId}
            checkoutUrl={vibetixEventListEmbed.checkoutUrl}
            labels={{ loading: t.booking.embedLoading, error: t.booking.embedError, fallback: t.booking.embedFallback }}
          />
        </div>
      </section>
    </>
  );
}
