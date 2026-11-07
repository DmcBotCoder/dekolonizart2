import { partners } from './media';

export interface Coach {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  href?: `https://${string}`;
}

/**
 * The reference page reuses the canonical partner records from media.ts;
 * there is intentionally no second partner data source.
 */
export const referenceOrganizations = partners;

/** Empty until the owner supplies confirmed coach profiles. */
export const coaches: readonly Coach[] = [];
