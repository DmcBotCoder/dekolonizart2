'use client';

import { useId, useMemo, useRef, useState } from 'react';
import type { EventItem } from '@/content/events';
import type { EventCategory } from '@/content/productions';
import { matchesQuery } from '@/lib/search';
import { Programme } from './ProgrammeRow';
import styles from './EventSearch.module.css';

interface EventSearchProps {
  events: EventItem[];
  labels: {
    search: string;
    placeholder: string;
    count: string;
    countOne: string;
    noResults: string;
    reset: string;
    filter: string;
    all: string;
  };
}

/**
 * Search field + category filter + the programme they narrow down. Search
 * matches name, subtitle, date or category (case and accents ignored, every
 * word must match). The category filter's own options and labels come
 * straight from `events` (each event already carries its `categoryLabel`),
 * so there is no separate category list to keep in sync.
 */
export function EventSearch({ events, labels }: EventSearchProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  // Only offer categories that actually occur – a filter must never lead to an empty list by itself.
  const available = useMemo(() => {
    const seen = new Map<EventCategory, string>();
    events.forEach((event) => {
      if (!seen.has(event.category)) seen.set(event.category, event.categoryLabel);
    });
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [events]);
  const visible = events.filter((event) => (category === 'all' || event.category === category) && matchesQuery(event.search, query));

  const status =
    visible.length === 0
      ? labels.noResults.replace('{q}', query.trim())
      : visible.length === 1
        ? labels.countOne
        : labels.count.replace('{n}', String(visible.length));

  return (
    <>
      <div className={styles.controls}>
        <form role="search" className={styles.search} onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={`${id}-q`}>{labels.search}</label>
          <div className={styles.field}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              ref={input}
              id={`${id}-q`}
              type="search"
              value={query}
              placeholder={labels.placeholder}
              autoComplete="off"
              enterKeyHint="search"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </form>

        {available.length > 1 && (
          <fieldset className={styles.filter}>
            <legend>{labels.filter}</legend>
            <div className={styles.chips}>
              {[{ id: 'all' as const, label: labels.all }, ...available].map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name={`${id}-cat`}
                    value={option.id}
                    checked={category === option.id}
                    onChange={() => setCategory(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <p className={styles.status} role="status">
        {status}
      </p>

      {visible.length === 0 ? (
        <button
          type="button"
          className="btn-line"
          onClick={() => {
            setQuery('');
            setCategory('all');
            input.current?.focus();
          }}
        >
          {labels.reset}
        </button>
      ) : (
        <Programme events={visible} headingLevel="h2" />
      )}
    </>
  );
}
