import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto py-16 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-x-12 md:space-x-0">
        <div>
          <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{t('features.find-remove.header')}</h4>
          <p
            className="pt-2 text-sm leading-6 font-semibold text-slate-600 dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: t('features.find-remove.body', {
                strongOpen: '<strong>',
                strongClose: '</strong>',
              }),
            }}
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{t('features.safer.header')}</h4>
          <p className="pt-2 text-sm leading-6 font-semibold text-slate-600 dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: t('features.safer.body', {
                strongOpen: '<strong>',
                strongClose: '</strong>',
              }),
            }}
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{t('features.open-source.header')}</h4>
          <p className="pt-2 text-sm leading-6 font-semibold text-slate-600 dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: t('features.open-source.body', {
                linkGithubOpen:
                  '<strong><a href="https://github.com/JMPerez/spotify-dedup/">',
                linkGithubClose: '</a></strong>',
                linkWebApiOpen:
                  '<a href="https://developer.spotify.com/web-api/">',
                linkWebApiClose: '</a>',
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
