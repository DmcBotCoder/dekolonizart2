'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './VibetixEmbed.module.css';

interface VibetixEmbedProps {
  embedId: string;
  checkoutUrl: `https://${string}`;
  labels: {
    loading: string;
    error: string;
    fallback: string;
  };
}

interface VibetixMessage {
  id?: unknown;
  type?: unknown;
  height?: unknown;
}

/** Provider-hosted VibeTix checkout with a safe fallback link and resize events. */
export function VibetixEmbed({ embedId, checkoutUrl, labels }: VibetixEmbedProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const src = useMemo(() => {
    if (typeof window === 'undefined') return checkoutUrl;
    const url = new URL(checkoutUrl);
    url.searchParams.set('return_url', window.location.href);
    return url.toString();
  }, [checkoutUrl]);

  useEffect(() => {
    const ready = () => {
      setLoading(false);
      setFailed(false);
    };
    const fail = () => {
      setLoading(false);
      setFailed(true);
    };
    const onMessage = (event: MessageEvent<VibetixMessage>) => {
      if (!frame.current || event.source !== frame.current.contentWindow) return;
      try {
        const origin = new URL(event.origin).hostname;
        if (origin !== 'vibetix.io' && !origin.endsWith('.vibetix.io')) return;
      } catch {
        return;
      }
      const data = event.data ?? {};
      if (String(data.id ?? '') !== embedId) return;
      if (data.type === 'vibetix:ready') ready();
      if (data.type === 'vibetix:error') fail();
      if (data.type === 'vibetix:height' || data.type === 'vibetix:resize') {
        const nextHeight = Number.parseInt(String(data.height ?? ''), 10);
        if (Number.isFinite(nextHeight)) setHeight(Math.max(300, nextHeight));
      }
    };

    window.addEventListener('message', onMessage);
    const timeout = window.setTimeout(() => {
      if (loading) fail();
    }, 15000);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timeout);
    };
  }, [embedId, loading]);

  return (
    <div className={styles.shell} style={{ minHeight: `${height}px` }}>
      {loading && !failed && <div className={styles.loading}>{labels.loading}</div>}
      {failed && (
        <div className={styles.error} role="alert">
          <strong>{labels.error}</strong>
          <a href={src} target="_blank" rel="noopener noreferrer">
            {labels.fallback}
          </a>
        </div>
      )}
      <iframe
        ref={frame}
        id={embedId}
        src={src}
        title="VibeTix ticket shop"
        className={styles.frame}
        loading="eager"
        scrolling="auto"
        referrerPolicy="origin-when-cross-origin"
        allow="payment; clipboard-write; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        onLoad={() => {
          setLoading(false);
          setFailed(false);
        }}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />
    </div>
  );
}
