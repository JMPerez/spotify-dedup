import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('sv', 'translation', {
    'menu.link-home': 'Hem',
    'home.title': 'Spotify Deduplicerare',
    'home.description':
      'Ta bort dubbletter från dina spellistor och sparade låtar.',
    'home.login-button': 'Logga in med Spotify',
    'meta.title':
      'Spotify Dedup - Ta bort dubbletter från ditt Spotify bibliotek automatiskt',
    'meta.description':
      'Ta bort upprepade låtar från dina Spotify-spellistor och sparade spår snabbt och enkelt.',
    'features.find-remove.header': 'Hitta & ta bort',
    'features.find-remove.body':
      'Dedup kontrollerar dina spellistor och sparade låtar i {{- strongOpen}}ditt Spotify bibliotek{{- strongClose}}. När Dedup hittar dubbletter kan du ta bort dom per spellistebasis.',
    'features.safer.header': 'Säkrare',
    'features.safer.body':
      'Dedup kommer bara ta bort {{- strongOpen}}dubbletter{{- strongClose}}, och lämna resten av spellistan och de sparade låtarna orörda.',
    'features.open-source.header': 'Öppen källkod',
    'features.open-source.body':
      "Du kanske skulle vilja ta en titt på {{- linkGithubOpen}}källkoden på GitHub{{- linkGithubClose}}. Den här webbappen använder {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} för att hantera användarens spellistor och sparade låtar.",
    'reviews.title': 'Så här säger användare',
    'footer.author': 'Gjord med ♥ av {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github':
      'Kolla in {{- linkOpen}}koden på GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Stöd projektet genom att {{- linkOpen}}bjuda på en kaffe ☕{{- linkClose}}',
    'bmc.button': 'Skulle du vilja bjuda mig på en kaffe?',
    'result.duplicate.reason-same-id': 'Dubblett',
    'result.duplicate.reason-same-data':
      'Dubblett (samma namn, artist och längd)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>av</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Letar efter dubbletter i dina spellistor och sparade låtar…',
    'process.status.complete': 'Bearbetning slutförd!',
    'process.status.complete.body':
      'Dina spellistor och sparade låtar har bearbetats!',
    'process.status.complete.dups.body':
      'Tryck på knappen {{- strongOpen}}Ta bort dubbletter{{- strongClose}} för att bli av med dubbletter i den spellistan eller sparade låtsamlingen.',
    'process.status.complete.nodups.body':
      "Grattis! Du har inga dubbletter i varken dina spellistor eller sparade låtar.",
    'process.reading-library':
      'Går igenom ditt bibliotek, letar efter spellistor som du äger och dina sparade låtar…',
    'process.processing':
      'Söker efter dubbletter, vänta ett ögonblick. Bearbetar fortfarande {{count}} spellista…',
    'process.processing_plural':
      'Söker efter dubbletter, vänta ett ögonblick. Bearbetar fortfarande {{count}} spellistor…',
    'process.saved.title': 'Sparade låtar i ditt bibliotek',
    'process.saved.duplicates':
      'Denna samling har {{count}} dubblett',
    'process.saved.duplicates_plural':
      'Denna samling har {{count}} dubbletter',
    'process.saved.remove-button': 'Ta bort dubbletter från dina sparade låtar',
    'process.playlist.duplicates':
      'Denna spellista har {{count}} dubblett',
    'process.playlist.duplicates_plural':
      'Denna spellista har {{count}} dubbletter',
    'process.playlist.remove-button': 'Ta bort dubbletter från denna spellista',
    'process.items.removed': 'Dubbletter har tagits bort',
    });
  i18n.changeLanguage('sv');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
