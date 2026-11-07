'use client';

import { useSyncExternalStore } from 'react';
import { isReducedMotion, subscribeNever } from '@/lib/motion';
import { youTubeEmbedUrl } from '@/lib/youtube';
import styles from './VideoIntro.module.css';

interface VideoIntroProps {
  id: string;
  /** Accessible name of the player. */
  title: string;
  /** Link for visitors without JavaScript. */
  fallbackLabel: string;
}

type Mode = 'autoplay' | 'paused';
const clientMode = (): Mode => (isReducedMotion() ? 'paused' : 'autoplay');
const serverMode = (): Mode | null => null;

/**
 * Intro video (YouTube, privacy-enhanced domain), as in version 1: starts
 * muted and loops; the player's own controls pause, resume and unmute it.
 * Visitors who reduce motion get it paused. The player is only fetched when
 * it comes near the viewport (`loading="lazy"`).
 */
export function VideoIntro({ id, title, fallbackLabel }: VideoIntroProps) {
  const mode = useSyncExternalStore(subscribeNever, clientMode, serverMode);

  return (
    <div className={styles.screen}>
      <div className={styles.frame}>
        {mode && (
          <iframe
            src={youTubeEmbedUrl(id, { autoplay: mode === 'autoplay' })}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        <noscript>
          <a className={styles.fallback} href={`https://www.youtube.com/watch?v=${id}`}>
            {fallbackLabel}
          </a>
        </noscript>
      </div>
    </div>
  );
}
