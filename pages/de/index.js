import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

export default () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('de', 'translation', {
    'menu.link-home': 'Home',
    'home.title': 'Spotify Deduplicator',
    'home.description':
      'Entfernen Sie doppelte Musiktitel aus Ihren Wiedergabelisten und gespeicherten Musiktiteln.',
    'home.login-button': 'Mit Spotify einloggen',
    'meta.title':
      'Spotify Dedup - Entfernen Sie doppelte Musiktitel automatisch aus Ihrer Spotify-Bibliothek',
    'meta.description':
      'Löschen Sie schnell und einfach wiederholte Songs aus Ihren Spotify-Wiedergabelisten und gespeicherten Titeln.',
    'features.find-remove.header': 'Suchen und entfernen',
    'features.find-remove.body':
      'Dedup überprüft Ihre Wiedergabelisten und speichert Titel in {{- strongOpen}}Ihrer Spotify-Bibliothek{{- strongClose}}. Sobald Dedup Duplikate gefunden hat, können Sie diese pro Wiedergabeliste entfernen.',
    'features.safer.header': 'Sicher',
    'features.safer.body':
      'Dedup entfernt nur {{- strongOpen}}duplizierte Songs{{- strongClose}} und lässt den Rest der Wiedergabeliste und die gespeicherten Songs unberührt.',
    'features.open-source.header': 'Open Source',
    'features.open-source.body':
      'Vielleicht möchten Sie sich den {{- linkGithubOpen}}Quellcode auf GitHub{{- linkGithubClose}} ansehen. Diese Webanwendung verwendet die {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}}, um die Wiedergabelisten und gespeicherten Titel der Benutzer zu verwalten.',
    'reviews.title': 'Dies ist, was Benutzer sagen',
    'footer.author':
      'Mit ♥ von {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}} gemacht',
    'footer.github':
      'Besuche die {{- linkOpen}}Code auf GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Unterstützen Sie das Projekt {{- linkOpen}}beim Kaffeekauf ☕{{- linkClose}}',
    'bmc.button': 'Würdest du mir einen Kaffee kaufen?',
    'result.duplicate.reason-same-id': 'Doppelt',
    'result.duplicate.reason-same-data':
      'Doppelt (gleicher Name, Künstler und Länge)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>vom</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Suche nach Duplikaten in deinen Wiedergabelisten und gespeicherten Titeln…',
    'process.status.complete': 'Bearbeitung abgeschlossen!',
    'process.status.complete.body':
      'Ihre Wiedergabelisten und gespeicherten Songs wurden verarbeitet!',
    'process.status.complete.dups.body':
      'Klicken Sie auf die {{- strongOpen}}Entfernen{{- strongClose}} Schaltfläche, um Duplikate in dieser Wiedergabeliste oder in der Sammlung gespeicherter Songs zu entfernen.',
    'process.status.complete.nodups.body':
      'Glückwunsch! Sie haben weder Duplikate in Ihren Wiedergabelisten noch in Ihren gespeicherten Titeln.',
    'process.reading-library':
      'Durchsuchen Sie Ihre Bibliothek und finden Sie die Wiedergabelisten, die Sie besitzen, und Ihre gespeicherten Songs…',
    'process.processing':
      'Suchen Sie nach doppelten Titeln, und warten Sie ein wenig. Es wird noch {{count}} Wiedergabeliste verarbeitet…',
    'process.processing_plural':
      'Suchen Sie nach doppelten Titeln, und warten Sie ein wenig. Noch {{count}} Wiedergabelisten zu verarbeiten…',
    'process.saved.title': 'Gespeicherte Songs in Ihrer Bibliothek',
    'process.saved.duplicates':
      'Diese Sammlung enthält {{count}} doppeltes Song',
    'process.saved.duplicates_plural':
      'Diese Sammlung enthält {{count}} doppelte Songs',
    'process.saved.remove-button': 'Duplikate entfernen',
    'process.playlist.duplicates':
      'Diese Wiedergabeliste enthält {{count}} doppeltes Lied',
    'process.playlist.duplicates_plural':
      'Diese Wiedergabeliste enthält {{count}} doppelte Titel',
    'process.playlist.remove-button': 'Duplikate entfernen',
    'process.items.removed': 'Duplikate entfernt',
  });
  i18n.changeLanguage('de');
  return (
    <Page>
      <Index />
    </Page>
  );
};
