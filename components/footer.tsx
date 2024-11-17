import LanguageSelector from './languageSelector';
import Link from 'next/link';
import { logEvent } from '@/utils/analytics';
import { useTranslation } from 'react-i18next';

const FOOTER_LINKS = [
  {
    translationKey: 'footer.author',
    href: 'https://jmperezperez.com',
  },
  {
    translationKey: 'footer.github',
    href: 'https://github.com/JMPerez/spotify-dedup/',
  },
  {
    translationKey: 'footer.bmc',
    href: 'https://www.buymeacoffee.com/jmp',
  },
];

const Footer = () => {
  const { t } = useTranslation();

  const trackPayPalClick = () => {
    logEvent('paypal_footer_clicked');
  };

  const renderLink = (translationKey: string, href: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: t(translationKey, {
          linkOpen: `<a target="_blank" rel="noreferrer" href="${href}">`,
          linkClose: '</a>',
        }),
      }}
    />
  );

  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm leading-6">
      <div className="py-10 border-t border-slate-200 dark:border-slate-200/5">
        <p className="mb-4 text-slate-500">
          {FOOTER_LINKS.map(({ translationKey, href }, index) => (
            <span key={href}>
              {renderLink(translationKey, href)}
              {index < FOOTER_LINKS.length && ' · '}
            </span>
          ))}
          <span> / </span>
          <Link
            href="https://www.paypal.com/paypalme/jmperezperez"
            target="_blank"
            onClick={trackPayPalClick}
          >
            PayPal
          </Link>
        </p>
        <LanguageSelector />
      </div>
    </footer>
  );
};

export default Footer;