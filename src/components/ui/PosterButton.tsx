'use client';

import Image from 'next/image';
import { openLightbox, type LightboxImage } from './Lightbox';
import styles from './PosterButton.module.css';

interface PosterButtonProps {
  image: LightboxImage;
  /** Accessible name of the button, e.g. "Enlarge poster: …". */
  label: string;
  zoomLabel: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** A poster that opens full size in the site-wide viewer. */
export function PosterButton({ image, label, zoomLabel, sizes, priority, className }: PosterButtonProps) {
  return (
    <button type="button" className={`${styles.poster} ${className ?? ''}`} aria-label={label} onClick={() => openLightbox(image)}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} />
      <span className={styles.zoom} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        {zoomLabel}
      </span>
    </button>
  );
}
