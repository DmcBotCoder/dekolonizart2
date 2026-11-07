'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Lightbox.module.css';

export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const EVENT = 'dk:lightbox';

/** Opens the site-wide poster viewer. */
export function openLightbox(image: LightboxImage) {
  window.dispatchEvent(new CustomEvent<LightboxImage>(EVENT, { detail: image }));
}

/**
 * One poster viewer for the whole site, in a native modal <dialog>: focus is
 * kept inside, Escape and a click on the backdrop close it, and focus returns
 * to the poster that opened it.
 */
export function Lightbox({ label, closeLabel }: { label: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => setImage((event as CustomEvent<LightboxImage>).detail);
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (image && !dialog.current?.open) dialog.current?.showModal();
  }, [image]);

  return (
    <dialog
      ref={dialog}
      className={styles.lightbox}
      aria-label={label}
      onClose={() => setImage(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- the full poster at its own resolution */}
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
          <form method="dialog">
            <button type="submit" className={styles.close} autoFocus>
              <span className="sr-only">{closeLabel}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3 3l14 14M17 3 3 17" stroke="currentColor" strokeWidth="2.2" />
              </svg>
            </button>
          </form>
        </>
      )}
    </dialog>
  );
}
