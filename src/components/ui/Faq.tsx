import styles from './Faq.module.css';

/** Questions and answers as native disclosures; the first one starts open. */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item, index) => (
        <details key={item.q} className={`disclosure ${styles.item}`} open={index === 0}>
          <summary>
            <span>{item.q}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
