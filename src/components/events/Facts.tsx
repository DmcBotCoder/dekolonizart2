import type { ReactNode } from 'react';
import styles from './Facts.module.css';

export interface Fact {
  label: string;
  value: ReactNode;
}

/** Key facts of an event (date, time, venue, credits) as a definition list. */
export function Facts({ items, columns = 2 }: { items: Fact[]; columns?: 1 | 2 }) {
  return (
    <dl className={`${styles.facts} ${columns === 1 ? styles.single : ''}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
