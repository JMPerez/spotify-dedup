import '../i18n';

import Index from '../components/pages/index';
import Page from '../layouts/main';
import React from 'react';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.changeLanguage('en');
  return (
    <Page>
      <Index />
    </Page>
  );
}

export default IndexComponent;
