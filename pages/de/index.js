import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

export default () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('de', 'translation', {
    'menu.link-home': 'Home',
    'home.title': 'Spotify Deduplicator',
    'home.description':
      'Entferne doppelte Musiktitel aus deinen Playlists und deiner Bibliothek.',
    'home.login-button': 'Mit Spotify einloggen',
    'meta.title':
      'Spotify Dedup - Entferne doppelte Musiktitel automatisch aus deiner Spotify-Bibliothek',
    'meta.description':
      'Lösche schnell und einfach doppelte Songs aus deinen Spotify-Playlists und gespeicherten Titeln.',
    'features.find-remove.header': 'Suchen und entfernen',
    'features.find-remove.body':
      'Dedup überprüft deine Playlists und speichert Titel in deiner {{- strongOpen}}Spotify-Bibliothek{{- strongClose}}. Sobald Dedup Duplikate gefunden hat, kannst du diese pro Playlist entfernen.',
    'features.safer.header': 'Sicher',
    'features.safer.body':
      'Dedup entfernt nur {{- strongOpen}}duplizierte Songs{{- strongClose}} und lässt den Rest der Playlist und die gespeicherten Titel unberührt.',
    'features.open-source.header': 'Open Source',
    'features.open-source.body':
      'Vielleicht möchten Sie sich den {{- linkGithubOpen}}Quellcode auf GitHub{{- linkGithubClose}} ansehen. Diese Webanwendung verwendet die {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}}, um die Playlists und gespeicherten Titel der Benutzer zu verwalten.',
    'reviews.title': 'Das sagen die Benutzer',
    'footer.author':
      'Mit ♥ von {{- linkOpen}}JMPerez{{- linkClose}} gemacht 👨‍💻',
    'footer.github': '{{- linkOpen}}Code auf GitHub{{- linkClose}} besuchen 📃',
    'footer.bmc':
      'Unterstütze das Projekt {{- linkOpen}}beim Kaffeekauf ☕{{- linkClose}}',
    'bmc.button': 'Würdest du mir einen Kaffee kaufen?',
    'result.duplicate.reason-same-id': 'Doppelt',
    'result.duplicate.reason-same-data':
      'Doppelt (Name, Künstler und Länge gleich)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>von</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Suche nach Duplikaten in deinen Playlists und gespeicherten Titeln…',
    'process.status.complete': 'Bearbeitung abgeschlossen!',
    'process.status.complete.body':
      'Deine Playlists und gespeicherten Songs wurden verarbeitet!',
    'process.status.complete.dups.body':
      'Klicke auf die Schaltfläche {{- strongOpen}}Duplikate entfernen{{- strongClose}}, um Duplikate aus der entsprechenden Playlist oder Sammlung gespeicherter Titel zu entfernen.',
    'process.status.complete.nodups.body':
      'Glückwunsch! Du hast weder Duplikate in deinen Playlists noch in deinen gespeicherten Titeln.',
    'process.reading-library':
      'Deine Bibliothek wird nach Duplikaten in Playlists und deinen gespeicherten Songs durchsucht…',
    'process.processing':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es ist noch {{count}} Playlist zu verarbeiten…',
    'process.processing_plural':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es sind noch {{count}} Playlists zu verarbeiten…',
    'process.saved.title': 'Gespeicherte Songs in deiner Bibliothek',
    'process.saved.duplicates':
      'Diese Sammlung enthält {{count}} doppelten Song',
    'process.saved.duplicates_plural':
      'Diese Sammlung enthält {{count}} doppelte Songs',
    'process.saved.remove-button': 'Duplikate entfernen',
    'process.playlist.duplicates':
      'Diese Playlist enthält {{count}} doppelten Titel',
    'process.playlist.duplicates_plural':
      'Diese Playlist enthält {{count}} doppelte Titel',
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
