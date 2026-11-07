import type { ImageAsset } from './media';

export type ActivityKind = 'class' | 'workshop';
export type ActivityFormat = 'in-person' | 'online' | 'hybrid';
export type ActivityTitleKey = 'movement' | 'theaterGeschichte';

/**
 * Structured schedule and registration data for classes and workshops.
 * Optional fields stay absent until the owner confirms the real-world value.
 */
export interface Activity {
  id: string;
  kind: ActivityKind;
  titleKey: ActivityTitleKey;
  format: ActivityFormat;
  start?: string;
  end?: string;
  recurrence?: string;
  time?: string;
  location?: string;
  price?: string;
  capacity?: number;
  registration?: {
    provider?: 'vibetix' | 'brevo' | 'email' | 'external';
    url: `https://${string}` | null;
    enabled: boolean;
  };
  image?: ImageAsset;
}

/** Add confirmed movement/class entries here without changing page components. */
export const movementActivities: readonly Activity[] = [];

/** Existing workshop data, kept as one record for the Artistic and Events views. */
export const workshopActivities: readonly Activity[] = [
  {
    id: 'theater-geschichte',
    kind: 'workshop',
    titleKey: 'theaterGeschichte',
    format: 'in-person',
    recurrence: 'by-arrangement',
    time: '14:00–17:00',
    location: 'Am Sudhaus 2, 12053 Berlin · Berlin Global Village',
    price: 'free',
    registration: { provider: 'email', url: null, enabled: true },
  },
];
