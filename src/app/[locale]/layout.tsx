import '@/styles/tokens.css';
import '@/styles/base.css';
import type { Metadata, Viewport } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RouteEffects } from '@/components/layout/RouteEffects';
import { Lightbox } from '@/components/ui/Lightbox';
import { resolveNav } from '@/content/navigation';
import { site, socials } from '@/content/site';
import { locales } from '@/i18n/config';
import { getI18n } from '@/i18n/server';
import { bootScript } from '@/lib/boot-script';

/* Movement: the stage voice — the kinetic, oversized headline/UI element. */
const movement = localFont({
  src: '../../fonts/MovementV.ttf',
  display: 'swap',
  variable: '--font-movement',
});

/* Source Sans: the voice of the written record — long-form reading text. */
const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  icons: { icon: '/img/logo.png', apple: '/img/logo.png' },
};

export const viewport: Viewport = {
  themeColor: '#181616',
  colorScheme: 'light',
};

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <html lang={locale} className={`${movement.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {t.common.skip}
        </a>
        <Header
          locale={locale}
          nav={resolveNav(t)}
          socials={socials}
          email={site.email}
          a11y={t.a11y}
          labels={{
            homeLink: t.common.homeLink,
            mainNav: t.common.mainNav,
            mobileNav: t.common.mobileNav,
            submenu: t.common.submenu,
            menu: t.common.menu,
            close: t.common.close,
            donation: t.common.donation,
            newTab: t.common.newTab,
            language: t.common.language,
            overview: t.ui.overview,
            follow: t.footer.follow,
          }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} t={t} />
        <Lightbox label={t.common.poster} closeLabel={t.common.closePoster} />
        <RouteEffects />
      </body>
    </html>
  );
}
