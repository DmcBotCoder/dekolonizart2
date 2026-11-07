import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const baseCss = readFileSync(new URL('./base.css', import.meta.url), 'utf8');

test('tokens.css defines every required custom property', () => {
  for (const name of ['--bg', '--fg', '--accent', '--btn-bg', '--font-display', '--font-ui', '--font-text', '--fs-h1', '--s-4', '--dur-3', '--ease-out']) {
    assert.ok(css.includes(`${name}:`), `missing ${name}`);
  }
});

test('tokens.css and base.css use only the DekolonizArt palette hex values', () => {
  const allowed = new Set(['464040', '135406', '7e2105', 'eadfdf', '5d1d1d', '3b2c2c', '181616', 'f0ffce', '9a391b', 'b34a25', 'f7f5f2', 'ddf7b8', 'a38b8b']);
  // `#000` / `#0000` are the only sanctioned exceptions: alpha-channel mask gradient
  // stops in .ticket::before/::after's button-notch mask (ported verbatim from
  // version-2/src/styles/base.css), where luminance/alpha is what's painted, not
  // a chosen color — not a new visible color in the design.
  const allowedShort = new Set(['000', '0000']);
  const combined = `${css}\n${baseCss}`;
  const hexes = [...combined.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g)].map((m) => m[1].toLowerCase());
  const offenders = hexes.filter((h) => (h.length === 6 ? !allowed.has(h) : !allowedShort.has(h)));
  assert.deepEqual(offenders, [], `unexpected colors: ${offenders.join(', ')}`);
});
