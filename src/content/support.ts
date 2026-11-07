import { site } from './site';

/** External destinations remain unconfigured until the owner supplies them. */
export const supportConfig = {
  donationProvider: 'WhyDonate',
  donationUrl: null as `https://${string}` | null,
  donationWidget: {
    slug: 'dekolonizart',
    primaryColor: '#135406',
    secondaryColor: '#9a391b',
    fontFamily: 'Source Sans Pro',
    buttonRadius: 27,
    cardRadius: 21,
    donationAmountSize: 16,
    buttonTextSize: 20,
  },
  community: {
    signalUrl: null as `https://${string}` | null,
    whatsappUrl: null as `https://${string}` | null,
    signupEmail: site.email,
  },
  brevo: {
    configuredByEnvironment: true,
    apiKeyEnv: 'BREVO_API_KEY',
    listIdEnv: 'BREVO_LIST_ID',
  },
} as const;
