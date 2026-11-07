import Script from 'next/script';
import styles from './WhyDonateWidget.module.css';

interface WhyDonateWidgetProps {
  slug: string;
  lang: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  buttonRadius: number;
  cardRadius: number;
  donationAmountSize: number;
  buttonTextSize: number;
}

/** WhyDonate's official fundraising widget, kept as a provider-owned checkout. */
export function WhyDonateWidget({
  slug,
  lang,
  primaryColor,
  secondaryColor,
  fontFamily,
  buttonRadius,
  cardRadius,
  donationAmountSize,
  buttonTextSize,
}: WhyDonateWidgetProps) {
  const id = `share-widget-${slug}`;
  return (
    <div className={styles.wrapper}>
      <link href="https://plugin.whydonate.com/wdplugin-style.css" rel="stylesheet" type="text/css" />
      <div
        id={id}
        className="share-widget"
        data-slug={slug}
        data-lang={lang}
        data-primary-color={primaryColor}
        data-secondary-color={secondaryColor}
        data-font-family={fontFamily}
        data-button-radius={buttonRadius}
        data-card-radius={cardRadius}
        data-donation-amount-size={donationAmountSize}
        data-button-text-size={buttonTextSize}
        data-card="show"
        data-form_mode="donation-form+widget"
      />
      <Script src="https://plugin.whydonate.com/wp_styling.js" strategy="afterInteractive" />
    </div>
  );
}
