'use client';

import { useId, useState, useSyncExternalStore, type FormEvent } from 'react';
import { isReducedMotion, reducedMotionServerSnapshot, setReducedMotion, subscribeNever } from '@/lib/motion';
import styles from './Footer.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterLabels {
  heading: string;
  emailLabel: string;
  send: string;
  thanks: string;
  errEmpty: string;
  errInvalid: string;
}

/**
 * Newsletter sign-up. As in version 1/2 it only validates: no mailing service
 * is connected yet (see the privacy policy), nothing is sent or stored.
 */
export function NewsletterForm({ labels }: { labels: NewsletterLabels }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(false);
    const email = value.trim();
    if (!email) setError(labels.errEmpty);
    else if (!EMAIL.test(email)) setError(labels.errInvalid);
    else {
      setError('');
      setDone(true);
      setValue('');
      return;
    }
    document.getElementById(`${id}-email`)?.focus();
  };

  return (
    <>
      <h2 id={`${id}-h`} className={styles.h}>
        {labels.heading}
      </h2>
      <form className={styles.form} aria-labelledby={`${id}-h`} noValidate onSubmit={submit}>
        <label className="sr-only" htmlFor={`${id}-email`}>
          {labels.emailLabel}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="btn" type="submit">
          {labels.send}
        </button>
      </form>
      {error && (
        <p id={`${id}-err`} className={styles.err}>
          {error}
        </p>
      )}
      <p className={styles.ok} role="status">
        {done ? labels.thanks : ''}
      </p>
    </>
  );
}

export function MotionToggle({ label, on, off }: { label: string; on: string; off: string }) {
  const reduced = useSyncExternalStore(subscribeNever, isReducedMotion, reducedMotionServerSnapshot);
  return (
    <button className={styles.motion} type="button" aria-pressed={reduced} onClick={() => setReducedMotion(!reduced)}>
      <span className={styles.dot} aria-hidden="true" />
      <span>
        {label}
        <span aria-hidden="true">: {reduced ? on : off}</span>
      </span>
    </button>
  );
}
