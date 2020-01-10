import React from 'react';

import Index from '../components/pages/index';
import Page from '../layouts/main';

import '../i18n';

class App extends React.Component {
  render() {
    return (
      <Page>
        <Index />
      </Page>
    );
  }
}
export default App;
