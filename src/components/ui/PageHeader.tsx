import type { ReactNode } from 'react';
import type { ImageAsset } from '@/content/media';
import type { Crumb } from '@/lib/breadcrumbs';
import { Breadcrumbs } from './Breadcrumbs';
import { CurtainImage } from './CurtainImage';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  breadcrumbLabel: string;
  /** Ancestors (localized hrefs); the current page is appended from `current`. */
  crumbs: Crumb[];
  current: string;
  kicker?: ReactNode;
  title: ReactNode;
  titleLang?: string;
  /** Rendered directly under the title (e.g. a production's original subtitle). */
  subtitle?: ReactNode;
  intro?: ReactNode;
  /** Seen through the torn-paper gap on the right (a horizontal band on phones). */
  image?: ImageAsset & { position?: string };
  /** `stage`: maroon opening for most pages. `paper`: quiet cream opening for long documents. */
  tone?: 'stage' | 'paper';
  /** Title size: `l` for most pages, `m` for long titles and documents. */
  size?: 'l' | 'm';
  children?: ReactNode;
}

/** The opening of every inner page: trail, title, intro – and optionally an image in the torn-paper gap. */
export function PageHeader({
  breadcrumbLabel,
  crumbs,
  current,
  kicker,
  title,
  titleLang,
  subtitle,
  intro,
  image,
  tone = 'stage',
  size = 'l',
  children,
}: PageHeaderProps) {
  return (
    <div className={`${tone === 'stage' ? 'surface-stage' : `surface-paper ${styles.paper}`} ${styles.header} ${image ? styles.withImage : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Breadcrumbs className={styles.crumbs} label={breadcrumbLabel} crumbs={crumbs} current={current} />
        <div className={styles.text}>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <h1 lang={titleLang} className={size === 'm' ? styles.titleM : styles.title}>
            {title}
          </h1>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          {intro && <p className={`lead ${styles.intro}`}>{intro}</p>}
          {children && <div className={styles.extra}>{children}</div>}
        </div>
        {image && <CurtainImage className={styles.slit} image={image} sizes="(min-width: 1024px) 75vw, 100vw" priority />}
      </div>
    </div>
  );
}
