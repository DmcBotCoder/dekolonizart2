import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from '../program-page.module.css';

const PATH = '/terms-of-sale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { t } = await getI18n();
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.terms, description: t.sales.pending });
}

export default async function TermsOfSalePage() {
  const { locale, t } = await getI18n();
  return (
    <>
      <PageHeader breadcrumbLabel={t.common.breadcrumb} crumbs={buildCrumbs(PATH, locale, t)} current={t.meta.titles.terms} kicker={t.sales.termsEyebrow} title={t.sales.termsTitle} tone="paper" />
      <section className="section">
        <div className="container">
          <p className={styles.legalPending}>{t.sales.pending}</p>
        </div>
      </section>
    </>
  );
}
