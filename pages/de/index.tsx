import '../../i18n';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('de', 'translation', {
    'menu.link-home': 'Home',
    'menu.link-stats': 'Statistiken',
    'home.title': 'Entfernen Sie doppelte Songs aus Ihrer Spotify-Bibliothek.',
    'home.description':
      'Spotify Dedup bereinigt Ihre Playlists und gespeicherten Songs von Ihrem Spotify-Konto. Es ist einfach und schnell.',
    'home.login-button': 'Mit Spotify einloggen',
    'home.review': 'Lesen Sie, was {{-supportersCount}} Unterstützer über Spotify Dedup auf {{- linkOpen}}Buy Me a Coffee{{- linkClose}} denken.',
    'meta.title':
      'Spotify Dedup - Entferne doppelte Musiktitel automatisch aus deiner Spotify-Bibliothek',
    'meta.description':
      'Entfernen Sie schnell und einfach doppelte Songs von Ihren Playlists und gespeicherten Tracks auf Spotify. Zeit sparen, Stress vermeiden!',
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
    'footer.musicalyst': 'Schauen Sie sich {{- linkOpen}}Musicalyst 🎧{{- linkClose}} an',
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
    'process.processing_one':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es ist noch {{count}} Playlist zu verarbeiten…',
    'process.processing_other':
      'Suche nach doppelten Titeln. Bitte warte ein wenig. Es sind noch {{count}} Playlists zu verarbeiten…',
    'process.saved.title': 'Lieblingssongs in deiner Bibliothek',
    'process.saved.duplicates_one':
      'Diese Sammlung enthält {{count}} doppelten Song',
    'process.saved.duplicates_other':
      'Diese Sammlung enthält {{count}} doppelte Songs',
    'process.saved.remove-button': 'Duplikate entfernen',
    'process.playlist.duplicates_one':
      'Diese Playlist enthält {{count}} doppelten Titel',
    'process.playlist.duplicates_other':
      'Diese Playlist enthält {{count}} doppelte Titel',
    'process.playlist.remove-button': 'Duplikate entfernen',
    'process.items.removed': 'Duplikate entfernt',
    'faq.section-title': "Häufig gestellte Fragen",
    'faq.question-1': 'Was macht diese Webanwendung?',
    'faq.answer-1': 'Spotify Dedup hilft Ihnen, Ihre Musikbibliotheken auf Spotify zu bereinigen, indem doppelte Titel in Wiedergabelisten und gespeicherten Titeln identifiziert und gelöscht werden.',
    'faq.question-2': 'Wie findet dieses Tool Duplikate?',
    'faq.answer-2': 'Das Tool findet Duplikate basierend auf der Songkennung, dem Titel, dem Interpreten und der Ähnlichkeit der Länge. Es identifiziert Duplikate, die die Anwendung von Spotify nicht findet.',
    'faq.question-3': 'Inwiefern ist dieses Tool besser als die Duplikaterkennung von Spotify?',
    'faq.answer-3': ' Derselbe Song kann mehrere Kennungen auf Spotify haben, die sich beide in derselben Veröffentlichung oder in mehreren befinden. Spotify warnt nur vor Duplikaten basierend auf der Song-ID, während dieses Tool Duplikate auch basierend auf Titel-, Interpreten- und Dauerähnlichkeit erkennt.',
    'faq.question-4': 'Wenn Duplikate gefunden werden, welche Songs werden entfernt?',
    'faq.answer-4': 'Dedup behält den ersten Song innerhalb einer Gruppe doppelter Songs und entfernt den Rest.',
    'faq.question-5': 'Sind meine Daten mit dieser Webanwendung sicher?',
    'faq.answer-5': 'Ja, diese Webanwendung speichert keine Benutzerdaten auf ihren Servern. Es fordert nur die minimalen Berechtigungen an, die zum Verarbeiten Ihrer Bibliothek erforderlich sind.',
    'faq.question-6': 'Welche Berechtigungen benötigt diese Webanwendung?',
    'faq.answer-6': 'Diese Webanwendung verwendet den Authentifizierungsdienst von Spotify, um auf Ihre gespeicherten Titel und Wiedergabelisten in Ihrer Bibliothek zuzugreifen.',
    'faq.question-7': 'Wie wurde dieses Tool getestet?',
    'faq.answer-7': 'Dieses Tool wurde von Tausenden von Benutzern erprobt, die es seit 2014 zur Identifizierung von Duplikaten in Millionen von Wiedergabelisten verwendet haben.',
    'faq.question-8': 'Kann dieses Tool Duplikate aus mehreren Wiedergabelisten löschen?',
    'faq.answer-8': 'Dieses Tool kann Duplikate in allen Wiedergabelisten in einer Bibliothek identifizieren und löschen, erkennt jedoch keine Duplikate eines Titels in mehreren Wiedergabelisten.',
    'faq.question-9': 'Wie kann ich die dieser Webanwendung erteilten Berechtigungen widerrufen?',
    'faq.answer-9': 'Benutzer können die dieser Webanwendung erteilten Berechtigungen jederzeit in Ihrem Spotify-Konto unter dem Abschnitt \'Apps\' widerrufen.',
    'faq.question-10': 'Funktioniert dieses Tool mit anderen Musik-Streaming-Diensten?',
    'faq.answer-10': 'Nein, dieses Tool funktioniert nur mit Spotify und verwendet die Web-API von Spotify, um Duplikate in Ihrer Bibliothek zu identifizieren und zu löschen.'
    ,
    // matching settings (UI)
    'matching-settings.title': 'Einstellungen für Duplikaterkennung (optional)',
    'matching-settings.enable-name-artist.title': 'Nach „Titel:Künstler“ abgleichen',
    'matching-settings.enable-name-artist.help': 'Wenn aktiviert, werden Einträge mit gleichem Titel, Hauptkünstler und ähnlicher Dauer als Duplikate erkannt.',
    'matching-settings.duration-threshold.label': 'Schwellenwert für Zeitdifferenz (Sekunden)',
    'matching-settings.duration-threshold.help': 'Gilt als gleich, wenn die Zeitdifferenz kleiner als dieser Wert ist.'
  });
  i18n.changeLanguage('de');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
