import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { PageHeader } from './PageHeader';

interface LegalPageProps {
  locale: Locale;
  t: Messages;
  path: string;
  current: string;
  kicker: string;
  /** German document title. */
  title: string;
  children: ReactNode;
}

/** Shell for the German-only legal documents (with a notice in the other languages). */
export function LegalPage({ locale, t, path, current, kicker, title, children }: LegalPageProps) {
  return (
    <>
      <PageHeader
        tone="paper"
        size="m"
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(path, locale, t)}
        current={current}
        kicker={kicker}
        title={title}
        titleLang={locale === 'de' ? undefined : 'de'}
      />
      <section className="surface-paper section-tight">
        <div className="container">
          <div className="doc">
            {locale !== 'de' && (
              <p className="legal-lang" role="note">
                {t.common.legalGermanOnly}
              </p>
            )}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
