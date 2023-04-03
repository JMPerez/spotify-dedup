import { useTranslation } from 'react-i18next';
const Faq = () => {
    const { t, i18n } = useTranslation();
    if (['en', 'es'].indexOf(i18n.language) === -1) {
        return null;
    }
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{t('faq.section-title')}</h2>
                <div className="grid pt-8 text-left border-t border-gray-200 md:gap-y-8 md:gap-x-16 dark:border-gray-700 md:grid-cols-2">
                    {Array(10).fill(null).map((_, i) => (<div className="mb-6" key={i}>
                        <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                            {t('faq.question-' + (i + 1))}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">{t('faq.answer-' + (i + 1))}</p>
                    </div>))}
                </div>
            </div>
        </section>
    )
};

export default Faq;
