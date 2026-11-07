import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

test('tokens.css defines every required custom property', () => {
  for (const name of ['--bg', '--fg', '--accent', '--btn-bg', '--font-display', '--font-ui', '--font-text', '--fs-h1', '--s-4', '--dur-3', '--ease-out']) {
    assert.ok(css.includes(`${name}:`), `missing ${name}`);
  }
});

test('tokens.css uses only the DekolonizArt palette hex values', () => {
  const allowed = new Set(['464040', '135406', '7e2105', 'eadfdf', '5d1d1d', '3b2c2c', '181616', 'f0ffce', '9a391b', 'b34a25', 'f7f5f2', 'ddf7b8', 'a38b8b']);
  const hexes = [...css.matchAll(/#([0-9a-fA-F]{6})\b/g)].map((m) => m[1].toLowerCase());
  const offenders = hexes.filter((h) => !allowed.has(h));
  assert.deepEqual(offenders, [], `unexpected colors: ${offenders.join(', ')}`);
});
