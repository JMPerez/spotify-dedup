import '../i18n';

import { useTranslation } from 'react-i18next';
import Index from '../components/pages/index';
import Page from '../layouts/main';

const IndexComponent = () => {
  const { i18n } = useTranslation();
  i18n.changeLanguage('en');
  return (
    <Page>
      <Index />
    </Page>
  );
}

export default IndexComponent;
