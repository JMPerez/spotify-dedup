import { useTranslation } from 'react-i18next';
import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('sv', 'translation', {
    'menu.link-home': 'Hem',
    'menu.link-stats': 'Statistik',
    'home.title': 'Ta bort dubbletter från ditt Spotify-bibliotek.',
    'home.description':
      'Spotify Dedup rensar dina spellistor och låtar sparade på Spotify. Det är enkelt och snabbt.',
    'home.login-button': 'Logga in med Spotify',
    'meta.title':
      'Spotify Dedup - Ta bort dubbletter från ditt Spotify bibliotek',
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
      'Du kanske skulle vilja ta en titt på {{- linkGithubOpen}}källkoden på GitHub{{- linkGithubClose}}. Den här webbappen använder {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} för att hantera användarens spellistor och sparade låtar.',
    'reviews.title': 'Så här säger användare',
    'footer.author': 'Gjord med ♥ av {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github': 'Kolla in {{- linkOpen}}koden på GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Stöd projektet genom att {{- linkOpen}}bjuda på en kaffe ☕{{- linkClose}}',
    'footer.musicalyst': 'Besök {{- linkOpen}}Musicalyst 🎧{{- linkClose}} för att få statistik om din nyligen spelade musik',
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
      'Grattis! Du har inga dubbletter i varken dina spellistor eller sparade låtar.',
    'process.reading-library':
      'Går igenom ditt bibliotek, letar efter spellistor som du äger och dina sparade låtar…',
    'process.processing_one':
      'Söker efter dubbletter, vänta ett ögonblick. Bearbetar fortfarande {{count}} spellista…',
    'process.processing_other':
      'Söker efter dubbletter, vänta ett ögonblick. Bearbetar fortfarande {{count}} spellistor…',
    'process.saved.title': 'Sparade låtar i ditt bibliotek',
    'process.saved.duplicates_one': 'Denna samling har {{ count }} dubblett',
    'process.saved.duplicates_other': 'Denna samling har {{count}} dubbletter',
    'process.saved.remove-button': 'Ta bort dubbletter från dina sparade låtar',
    'process.playlist.duplicates_one': 'Denna spellista har {{count}} dubblett',
    'process.playlist.duplicates_other':
      'Denna spellista har {{count}} dubbletter',
    'process.playlist.remove-button': 'Ta bort dubbletter från denna spellista',
    'process.items.removed': 'Dubbletter har tagits bort',
    'spotifytop.heading': '🚀 Nytt projekt, Musicalyst!',
    'spotifytop.description':
      'Har du någonsin undrat vilka artister, låtar eller genrer du har lyssnat mest på på Spotify nyligen?',
    'spotifytop.check1': 'Ta en titt på mitt nya verktyg',
    'spotifytop.check2':
      'för att se en rapport om vad du nyligen har spelat på Spotify.',
    'faq.section-title': "Vanliga frågor",
    'faq.question-1': 'Vad gör den här webbapplikationen?',
    'faq.answer-1': 'Spotify Dedup hjälper dig att rensa upp i dina musikbibliotek på Spotify genom att identifiera och ta bort dubbletter av låtar över spellistor och sparade låtar.',
    'faq.question-2': 'Hur hittar det här verktyget dubbletter?',
    'faq.answer-2': 'Verktyget hittar dubbletter baserat på låtens identifierare, titel, artist och längdlikhet. Den identifierar dubbletter som Spotifys applikation inte hittar.',
    'faq.question-3': 'Hur är det här verktyget bättre än Spotifys dubblettdetektering?',
    'faq.answer-3': ' Samma låt kan ha flera identifierare på Spotify som både finns i samma release eller i flera. Spotify varnar bara för dubbletter baserat på låtidentifieraren, medan det här verktyget också upptäcker dubbletter baserat på titel, artist och varaktighetslikhet.',
    'faq.question-4': 'När dubbletter hittas, vilka låtar tas bort?',
    'faq.answer-4': 'Dedup kommer att behålla den första låten i en grupp dubbletter av låtar och tar bort resten.',
    'faq.question-5': 'Är mina data säkra med denna webbapplikation?',
    'faq.answer-5': 'Ja, denna webbapplikation lagrar inga användardata på sina servrar. Den begär bara den minsta uppsättningen av behörigheter som krävs för att bearbeta ditt bibliotek.',
    'faq.question-6': 'Vilka behörigheter kräver denna webbapplikation?',
    'faq.answer-6': 'Denna webbapplikation använder Spotifys autentiseringstjänst för att komma åt dina sparade spår och spellistor i ditt bibliotek.',
    'faq.question-7': 'Hur har detta verktyg testats?',
    'faq.answer-7': 'Detta verktyg har testats av tusentals användare som har använt det för att identifiera dubbletter i miljontals spellistor sedan 2014.',
    'faq.question-8': 'Kan det här verktyget ta bort dubbletter över flera spellistor?',
    'faq.answer-8': 'Detta verktyg kan identifiera och ta bort dubbletter på alla spellistor i ett bibliotek, men upptäcker inte dubbletter av en låt över flera spellistor.',
    'faq.question-9': 'Hur kan jag återkalla de behörigheter som beviljats för denna webbapplikation?',
    'faq.answer-9': 'Användare kan när som helst återkalla de behörigheter som beviljats för denna webbapplikation på ditt Spotify-konto, under avsnittet \'Appar\'.',
    'faq.question-10': 'Fungerar det här verktyget med andra musikströmningstjänster?',
    'faq.answer-10': 'Nej, det här verktyget fungerar bara med Spotify och använder Spotifys webb-API för att identifiera och ta bort dubbletter i ditt bibliotek.'
  });
  i18n.changeLanguage('sv');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
