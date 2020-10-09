import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('de', 'translation', {
    'menu.link-home': 'Home',
    'home.title': 'Spotify Deduplicator',
    'home.description':
      'Entferne doppelte Songs aus deinen Playlists und deinen Lieblingssongs.',
    'home.login-button': 'Mit Spotify einloggen',
    'meta.title':
      'Spotify Dedup - Entferne doppelte Musiktitel automatisch aus deiner Spotify-Bibliothek',
    'meta.description':
      'Lösche schnell und einfach doppelte Songs aus deinen Spotify-Playlists und Lieblingssongs.',
    'features.find-remove.header': 'Finden und löschen',
    'features.find-remove.body':
      'Dedup überprüft deine Playlists und Lieblingssongs in deiner {{- strongOpen}}Spotify-Bibliothek{{- strongClose}}. Sobald Dedup Duplikate gefunden hat, kannst du diese pro Playlist entfernen.',
    'features.safer.header': 'Sicher',
    'features.safer.body':
      'Dedup entfernt nur {{- strongOpen}}doppelte Songs{{- strongClose}} und lässt den Rest der Playlist und die Lieblingssongs unberührt.',
    'features.open-source.header': 'Open Source',
    'features.open-source.body':
      'Vielleicht möchtest du dir den {{- linkGithubOpen}}Quellcode auf GitHub{{- linkGithubClose}} ansehen. Diese Webanwendung verwendet die {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}}, um die Playlists und Lieblingssongs der Nutzer zu verwalten.',
    'reviews.title': 'Das sagen die Nutzer',
    'footer.author':
      'Mit ♥ gemacht von {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github': '{{- linkOpen}}Code auf GitHub{{- linkClose}} ansehen 📃',
    'footer.bmc':
      'Unterstütze das Projekt {{- linkOpen}}beim Kaffeekauf ☕{{- linkClose}}',
    'bmc.button': 'Würdest du mir einen Kaffee kaufen?',
    'result.duplicate.reason-same-id': 'Doppelt',
    'result.duplicate.reason-same-data':
      'Doppelt (Name, Künstler und Länge gleich)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>von</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Suche nach doppelten Titeln in deinen Playlists und Lieblingssongs…',
    'process.status.complete': 'Bearbeitung abgeschlossen!',
    'process.status.complete.body':
      'Deine Playlists und Lieblingssongs wurden verarbeitet!',
    'process.status.complete.dups.body':
      'Klicke auf die Schaltfläche {{- strongOpen}}Duplikate entfernen{{- strongClose}}, um Duplikate aus der entsprechenden Playlist oder deinen Lieblingssongs zu entfernen.',
    'process.status.complete.nodups.body':
      'Glückwunsch! Du hast weder Duplikate in deinen Playlists noch in deinen Lieblingssongs.',
    'process.reading-library':
      'Deine Bibliothek wird nach Duplikaten in Playlists und deinen Lieblingssongs durchsucht…',
    'process.processing':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es ist noch {{count}} Playlist zu verarbeiten…',
    'process.processing_plural':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es sind noch {{count}} Playlists zu verarbeiten…',
    'process.saved.title': 'Lieblingssongs in deiner Bibliothek',
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

export default IndexComponent;
