import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datePartsShortYear, splitLastWord } from './text.ts';

test('the hero headline keeps the key word apart in every language', () => {
  assert.deepEqual(splitLastWord('the Art of Remembrance,'), ['the Art of', 'Remembrance,']);
  assert.deepEqual(splitLastWord('die Kraft der Erneuerung.'), ['die Kraft der', 'Erneuerung.']);
  assert.deepEqual(splitLastWord('L’art du souvenir,'), ['L’art du', 'souvenir,']);
  assert.deepEqual(splitLastWord('Renewal.'), ['', 'Renewal.']);
});

test('dates in any of the site’s notations become day | month | short year', () => {
  assert.deepEqual(datePartsShortYear('13.12.2026'), ['13', '12', '26']);
  assert.deepEqual(datePartsShortYear('13/12/2026'), ['13', '12', '26']);
});
