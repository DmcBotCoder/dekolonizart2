import { initials } from '@/content/team';
import styles from './Initials.module.css';

/** Stand-in when there is no portrait: the initials, set wide on terracotta (decorative – the name is beside it). */
export function Initials({ name, size = 'm' }: { name: string; size?: 's' | 'm' | 'l' }) {
  return (
    <span className={`${styles.plate} ${styles[size]}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
