import { useTranslation } from 'react-i18next';
import LanguageSelector from './languageSelector';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm leading-6">
      <div className="pt-10 pb-14 border-t border-slate-200 justify-between text-slate-500 dark:border-slate-200/5">
        <p className="mb-4">
          <span
            dangerouslySetInnerHTML={{
              __html: t('footer.author', {
                linkOpen:
                  '<a target="_blank" rel="noreferrer" href="https://jmperezperez.com">',
                linkClose: '</a>',
              }),
            }}
          />{' '}
          ·{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: t('footer.github', {
                linkOpen:
                  '<a target="_blank" rel="noreferrer" href="https://github.com/JMPerez/spotify-dedup/">',
                linkClose: '</a>',
              }),
            }}
          />
          ·{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: t('footer.bmc', {
                linkOpen:
                  '<a target="_blank" rel="noreferrer" href="https://www.buymeacoffee.com/jmp">',
                linkClose: '</a>',
              }),
            }}
          />
          ·{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: t('footer.musicalyst', {
                linkOpen:
                  '<a target="_blank" rel="noreferrer" href="https://musicalyst.com">',
                linkClose: '</a>',
              }),
            }}
          />
        </p>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Footer;
