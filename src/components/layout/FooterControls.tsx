'use client';

import { useId, useState, useSyncExternalStore, type FormEvent } from 'react';
import { isReducedMotion, reducedMotionServerSnapshot, setReducedMotion, subscribeNever } from '@/lib/motion';
import styles from './Footer.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterLabels {
  heading: string;
  emailLabel: string;
  consent: string;
  send: string;
  sending: string;
  thanks: string;
  errEmpty: string;
  errInvalid: string;
  errConsent: string;
  errUnavailable: string;
  errProvider: string;
}

export function NewsletterForm({ labels }: { labels: NewsletterLabels }) {
  const [value, setValue] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const id = useId();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setDone(false);
    setError('');
    const email = value.trim();
    if (!email) setError(labels.errEmpty);
    else if (!EMAIL.test(email)) setError(labels.errInvalid);
    else if (!consent) setError(labels.errConsent);
    else {
      setBusy(true);
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, consent }),
        });
        if (response.ok) {
          setDone(true);
          setValue('');
          setConsent(false);
        } else {
          setError(response.status === 503 ? labels.errUnavailable : labels.errProvider);
        }
      } catch {
        setError(labels.errUnavailable);
      } finally {
        setBusy(false);
      }
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
        <button className="btn" type="submit" disabled={busy}>
          {busy ? labels.sending : labels.send}
        </button>
        <label className={styles.consent}>
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>{labels.consent}</span>
        </label>
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
