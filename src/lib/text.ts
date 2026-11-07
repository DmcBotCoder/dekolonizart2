/** "the Art of Remembrance," → ["the Art of", "Remembrance,"] – the hero sets the last word apart. */
export function splitLastWord(line: string): [string, string] {
  const trimmed = line.trim();
  const at = trimmed.lastIndexOf(' ');
  return at === -1 ? ['', trimmed] : [trimmed.slice(0, at), trimmed.slice(at + 1)];
}

/** "13.12.2026" or "13/12/2026" → ["13", "12", "26"] (the poster's own date notation). */
export function datePartsShortYear(date: string): string[] {
  return date
    .split(/[./\s-]+/)
    .filter(Boolean)
    .map((part, i) => (i === 2 ? part.slice(-2) : part));
}
