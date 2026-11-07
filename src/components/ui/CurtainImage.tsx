import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ImageAsset } from '@/content/media';
import styles from './CurtainImage.module.css';

interface CurtainImageProps {
  image: ImageAsset & { position?: string };
  /** Leave empty for decorative images. */
  alt?: string;
  /** Remember the crop: a landscape photo covering a tall gap needs a source wider than the gap itself. */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Stagger in ms when several images reveal together. */
  delay?: number;
}

/**
 * An image that tears open like paper when it enters the viewport (an
 * irregular ripped edge resolving to a clean rectangle). Fills its box – the
 * parent sets the shape. Keeps the component name `CurtainImage` for
 * import-path continuity even though the reveal metaphor is now torn paper,
 * not a parting curtain.
 */
export function CurtainImage({ image, alt = '', sizes, className, priority, delay }: CurtainImageProps) {
  return (
    <figure
      className={`${styles.curtain} ${className ?? ''}`}
      data-reveal="torn"
      style={delay ? ({ '--delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {/* The clip sits on an inner layer: IntersectionObserver ignores elements whose own clip hides them. */}
      <div className="curtain-inner">
        <Image src={image.src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectPosition: image.position ?? '50% 50%' }} />
      </div>
    </figure>
  );
}
