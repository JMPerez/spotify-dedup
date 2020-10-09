import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('nl', 'translation', {
    'menu.link-home': 'Home',
    'home.title': 'Spotify Deduplicator',
    'home.description':
      'Verwijder dubbele nummers uit je afspeellijsten en opgeslagen nummers.',
    'home.login-button': 'Log in met Spotify',
    'meta.title':
      'Spotify Dedup - Verwijder automatisch dubbele nummers uit je Spotify-bibliotheek',
    'meta.description':
      'Verwijder snel en gemakkelijk herhaalde nummers uit je Spotify-afspeellijsten en opgeslagen nummers.',
    'features.find-remove.header': 'Zoeken en verwijderen',
    'features.find-remove.body':
      'Dedup controleert je afspeellijsten en opgeslagen nummers in {{- strongOpen}}je Spotify-bibliotheek{{- strongClose}}. Zodra Dedup duplicaten heeft gevonden, kun je ze per afspeellijst verwijderen.',
    'features.safer.header': 'Veiliger',
    'features.safer.body':
      'Dedup verwijdert alleen {{- strongOpen}}dubbele nummers{{- strongClose}}, waardoor de rest van de afspeellijst en opgeslagen nummers onaangetast blijven.',
    'features.open-source.header': 'Open Source',
    'features.open-source.body':
      'Misschien wil je de {{- linkGithubOpen}}broncode op GitHub bekijken{{- linkGithubClose}}. Deze webapp gebruikt de {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} om de afspeellijsten en opgeslagen tracks van gebruikers te beheren.',
    'reviews.title': 'Dit zeggen gebruikers',
    'footer.author':
      'Gemaakt met ♥ door {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github': 'Bekijk de {{- linkOpen}}code op GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Steun het project door {{- linkOpen}}een koffietje voor me te kopen ☕{{- linkClose}}',
    'bmc.button': 'Zou je koffie voor me willen kopen?',
    'result.duplicate.reason-same-id': 'Duplicaat',
    'result.duplicate.reason-same-data':
      'Duplicaat (zelfde naam, artiest en duur)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>door</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Er wordt gezocht naar duplicaten in je afspeellijsten en opgeslagen nummers…',
    'process.status.complete': 'Verwerking voltooid!',
    'process.status.complete.body':
      'Je afspeellijsten en opgeslagen nummers zijn verwerkt!',
    'process.status.complete.dups.body':
      'Klik op de knop {{- strongOpen}}Verwijder duplicaten{{- strongClose}} om duplicaten uit die afspeellijst of uit je opgeslagen nummers te verwijderen.',
    'process.status.complete.nodups.body':
      'Gefeliciteerd! Je hebt geen duplicaten in je afspeellijsten en/of opgeslagen nummers.',
    'process.reading-library':
      'Er wordt gezocht naar de afspeellijsten en opgeslagen nummers in je bibliotheek…',
    'process.processing':
      'Er wordt gezocht naar duplicaten. Nog {{count}} afspeellijst te gaan…',
    'process.processing_plural':
      'Er wordt gezocht naar duplicaten. Nog {{count}} afspeellijsten te gaan…',
    'process.saved.title': 'Opgeslagen nummers in je bibliotheek',
    'process.saved.duplicates':
      'Deze verzameling heeft {{count}} dubbel nummer',
    'process.saved.duplicates_plural':
      'Deze verzameling heeft {{count}} dubbele nummers',
    'process.saved.remove-button':
      'Verwijder duplicaten uit je opgeslagen nummers',
    'process.playlist.duplicates':
      'Deze afspeellijst heeft {{count}} dubbel nummer',
    'process.playlist.duplicates_plural':
      'Deze afspeellijst heeft {{count}} dubbele nummers',
    'process.playlist.remove-button':
      'Verwijder duplicaten uit deze afspeellijst',
    'process.items.removed': 'Duplicaten verwijderd',
  });
  i18n.changeLanguage('nl');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
