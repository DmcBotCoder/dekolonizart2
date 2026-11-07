import Image from 'next/image';
import type { ProductionMedia as ProductionMediaItem } from '@/content/media';
import { youTubeId } from '@/lib/youtube';
import { VideoIntro } from './VideoIntro';
import styles from './ProductionMedia.module.css';

interface ProductionMediaProps {
  items: readonly ProductionMediaItem[];
  heading: string;
  videoLabel: string;
  audioLabel: string;
}

/** Renders only configured project media; missing audio/video never creates an empty player. */
export function ProductionMedia({ items, heading, videoLabel, audioLabel }: ProductionMediaProps) {
  if (items.length === 0) return null;
  return (
    <section className={styles.block} aria-labelledby="media-title">
      <h2 id="media-title">{heading}</h2>
      <div className={styles.grid}>
        {items.map((item, index) => {
          if (item.kind === 'image') {
            return <Image key={`${item.kind}-${index}`} src={item.image.src} alt={item.alt} width={item.image.width} height={item.image.height} sizes="(min-width: 1024px) 45vw, 100vw" />;
          }
          if (item.kind === 'video') {
            const id = youTubeId(item.url);
            return <VideoIntro key={`${item.kind}-${index}`} id={id} title={item.title} fallbackLabel={videoLabel} />;
          }
          return (
            <figure key={`${item.kind}-${index}`} className={styles.audio}>
              <figcaption>{item.title}</figcaption>
              <audio controls preload="none" aria-label={`${audioLabel}: ${item.title}`} src={item.url} />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
