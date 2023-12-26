import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const AvailableLanguages = [
  'de',
  'en',
  'es',
  'fr',
  'id',
  'it',
  'nl',
  'pl',
  'pt',
  'sv',
  'tr',
];

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'menu.link-home': 'Home',
      'menu.link-stats': 'Stats',
      'home.title': 'Remove duplicate songs from your Spotify library.',
      'home.description':
        'Spotify Dedup cleans up your playlists and liked songs from your Spotify account. It\'s easy and fast.',
      'home.review': 'Read what {{-supportersCount}} supporters think about Spotify Dedup on {{- linkOpen}}Buy Me a Coffee{{- linkClose}}',
      'home.login-button': 'Log in with Spotify',
      'meta.title':
        'Spotify Dedup - Remove duplicate songs from your Spotify library',
      'meta.description':
        'Delete repeated songs from your Spotify playlists and liked songs automatically. Fix your music library. Quickly and easy.',
      'features.find-remove.header': 'Find & remove',
      'features.find-remove.body':
        'Dedup checks your playlists and liked songs in {{- strongOpen}}your Spotify library{{- strongClose}}. Once Dedup finds duplicates you can remove them on a per-playlist basis.',
      'features.safer.header': 'Safer',
      'features.safer.body':
        'Dedup will only remove {{- strongOpen}}duplicate songs{{- strongClose}}, leaving the rest of the playlist and liked songs untouched.',
      'features.open-source.header': 'Open Source',
      'features.open-source.body':
        "You might want to have a look at the {{- linkGithubOpen}}source code on GitHub{{- linkGithubClose}}. This web app uses the {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} to manage user's playlists and liked songs.",
      'reviews.title': 'This is what users are saying',
      'footer.author': 'Made with ♥ by {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
      'footer.github':
        'Check out the {{- linkOpen}}code on GitHub 📃{{- linkClose}}',
      'footer.bmc':
        'Support the project {{- linkOpen}}buying a coffee ☕{{- linkClose}}',
      'footer.musicalyst':
        'Visit {{- linkOpen}}Musicalyst{{- linkClose}} to see stats about your listening history 🎧',
      'bmc.button': 'Would you buy me a coffee?',
      'result.duplicate.reason-same-id': 'Duplicate',
      'result.duplicate.reason-same-data':
        'Duplicate (same name, artist and duration)',
      'result.duplicate.track':
        '<0>{{trackName}}</0> <2>by</2> <4>{{trackArtistName}}</4>',
      'process.status.finding':
        'Finding duplicates in your playlists and liked songs…',
      'process.status.complete': 'Processing complete!',
      'process.status.complete.body':
        'Your playlists and liked songs have been processed!',
      'process.status.complete.dups.body':
        'Click on the {{- strongOpen}}Remove duplicates{{- strongClose}} button to get rid of duplicates in that playlist or liked songs collection.',
      'process.status.complete.nodups.body':
        "Congrats! You don't have duplicates in your playlists nor liked songs.",
      'process.reading-library':
        'Going through your library, finding the playlists you own and your liked songs…',
      'process.processing_one':
        'Searching for duplicate songs, wait a sec. Still to process {{count}} playlist…',
      'process.processing_other':
        'Searching for duplicate songs, wait a sec. Still to process {{count}} playlists…',
      'process.saved.title': 'liked songs in your library',
      'process.saved.duplicates_one':
        'This collection has {{count}} duplicate song',
      'process.saved.duplicates_other':
        'This collection has {{count}} duplicate songs',
      'process.saved.remove-button': 'Remove duplicates from your liked songs',
      'process.playlist.duplicates_one':
        'This playlist has {{count}} duplicate song',
      'process.playlist.duplicates_other':
        'This playlist has {{count}} duplicate songs',
      'process.playlist.remove-button': 'Remove duplicates from this playlist',
      'process.items.removed': 'Duplicates removed',
      'spotifytop.heading': '🚀 Introducing Musicalyst!',
      'spotifytop.description':
        'Ever wondered what artists, songs, or genres you have been listening the most lately?',
      'spotifytop.check1': 'Check my latest project',
      'spotifytop.check2':
        'to get personalized insights about what you have been playing on Spotify',
      'faq.section-title': "Frequently asked questions",
      'faq.question-1': 'What does this web application do?',
      'faq.answer-1': 'Spotify Dedup helps you clean up your music libraries on Spotify by identifying and deleting duplicate songs across playlists and liked songs.',
      'faq.question-2': 'How does it find duplicates?',
      'faq.answer-2': 'Dedup finds duplicates based on the songs identifier, title, artist, and duration similarity. It identifies duplicates that Spotify\'s application does not catch.',
      'faq.question-3': 'How is Dedup better than Spotify\'s built-in duplicate detection?',
      'faq.answer-3': 'Spotify\'s applications only warn about duplicates when adding a song to a playlit or liked songs with the exact same song identifier. However, the same song can have multiple identifiers on Spotify that both in the same release or in several ones. Dedup detects duplicates based on title, artist, and duration similarity.',
      'faq.question-4': 'When duplicates are found, which songs are removed?',
      'faq.answer-4': 'Dedup will keep the first song within a group of duplicate songs, and will remove the rest.',
      'faq.question-5': 'Is my data safe with this web application?',
      'faq.answer-5': 'Yes, this web application does not store any user data on its servers. It only requests the minimum set of permissions necessary to process your library.',
      'faq.question-6': 'What permissions does this web application require?',
      'faq.answer-6': 'This web application uses Spotify\'s authentication service to access your liked songs and playlists in your library.',
      'faq.question-7': 'How has this tool been tested?',
      'faq.answer-7': 'This tool has been battle-tested by thousands of users who have used it to identify duplicates in millions of playlists since 2014.',
      'faq.question-8': 'Can this tool delete duplicates across multiple playlists?',
      'faq.answer-8': 'This tool can identify and delete duplicates on all playlists in a library, but doesn\'t detect duplicates of a song across multiple playlists.',
      'faq.question-9': 'How can I revoke the permissions granted to this web application?',
      'faq.answer-9': 'You can revoke the permissions granted to this web application at any time on your Spotify account, under the \'Apps\' section.',
      'faq.question-10': 'Does this tool work with other music streaming services?',
      'faq.answer-10': 'No, this tool only works with Spotify through Spotify\'s Web API.',
    },
  },
  fallbackLng: 'en',
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    debug: false,
    react: {
      transSupportBasicHtmlNodes: false,
    },
    missingKeyHandler: (
      lng,
      ns,
      key,
      fallbackValue,
      updateMissing,
      options
    ) => {
      console.log('Missing key', key);
    },
  });
export default i18n;
