'use client';

import { useId, useState } from 'react';
import styles from './ReadMore.module.css';

export const MORE_MARKER = '<!--more-->';

export type ReadMoreBlock = { kind: 'p' | 'h3'; text: string };

interface ReadMoreProps {
  blocks: ReadMoreBlock[];
  labels: { more: string; less: string };
  lang?: string;
}

/**
 * Editor-controlled "Read More" (same contract as version 1): the text breaks
 * wherever the content contains `<!--more-->`. The hidden part stays in the
 * normal document flow, so everything below simply moves down when it opens.
 * Without a marker the whole text is shown and there is no button.
 */
export function ReadMore({ blocks, labels, lang }: ReadMoreProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const breakIndex = blocks.findIndex((block) => block.kind === 'p' && block.text.includes(MORE_MARKER));

  const renderBlock = (block: ReadMoreBlock, key: number) =>
    block.kind === 'h3' ? (
      <h3 key={key} className={styles.subhead}>
        {block.text}
      </h3>
    ) : (
      <p key={key}>{block.text}</p>
    );

  if (breakIndex === -1) {
    return (
      <div className={styles.text} lang={lang}>
        {blocks.map(renderBlock)}
      </div>
    );
  }

  const [visible, continuation] = blocks[breakIndex].text.split(MORE_MARKER);
  const before = blocks.slice(0, breakIndex);
  const after = blocks.slice(breakIndex + 1);

  return (
    <div className={`${styles.text} ${open ? styles.isOpen : ''}`} lang={lang}>
      {before.map(renderBlock)}
      <p>
        {visible.trimEnd()}
        <span aria-hidden="true" hidden={open}>
          …
        </span>
        <span id={`${id}-inline`} hidden={!open}>
          {' '}
          {continuation.trimStart()}
        </span>
      </p>
      {after.length > 0 && (
        <div id={`${id}-rest`} className={styles.rest} hidden={!open}>
          {after.map(renderBlock)}
        </div>
      )}
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={after.length ? `${id}-inline ${id}-rest` : `${id}-inline`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.icon} aria-hidden="true" />
        {open ? labels.less : labels.more}
      </button>
    </div>
  );
}
