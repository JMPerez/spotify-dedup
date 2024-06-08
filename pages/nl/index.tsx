import '../../i18n';

import { useTranslation } from 'react-i18next';
import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('nl', 'translation', {
    'menu.link-home': 'Home',
    'menu.link-stats': 'Statistieken',
    'home.title': 'Verwijder dubbele nummers uit je Spotify-bibliotheek.',
    'home.description':
      'Spotify Dedup maakt je afspeellijsten en opgeslagen nummers schoon van je Spotify-account. Het is makkelijk en snel.',
    'home.login-button': 'Log in met Spotify',
    'home.review': 'Lees wat {{-supportersCount}} supporters vinden van Spotify Dedup op {{- linkOpen}}Buy Me a Coffee{{- linkClose}}.',
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
    'footer.musicalyst': "Bezoek {{- linkOpen}}Musicalyst 🎧{{- linkClose}} om statistieken van je Spotify te bekijken",
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
    'process.processing_one':
      'Er wordt gezocht naar duplicaten. Nog {{count}} afspeellijst te gaan…',
    'process.processing_other':
      'Er wordt gezocht naar duplicaten. Nog {{count}} afspeellijsten te gaan…',
    'process.saved.title': 'Opgeslagen nummers in je bibliotheek',
    'process.saved.duplicates_one':
      'Deze verzameling heeft {{count}} dubbel nummer',
    'process.saved.duplicates_other':
      'Deze verzameling heeft {{count}} dubbele nummers',
    'process.saved.remove-button':
      'Verwijder duplicaten uit je opgeslagen nummers',
    'process.playlist.duplicates_one':
      'Deze afspeellijst heeft {{count}} dubbel nummer',
    'process.playlist.duplicates_other':
      'Deze afspeellijst heeft {{count}} dubbele nummers',
    'process.playlist.remove-button':
      'Verwijder duplicaten uit deze afspeellijst',
    'process.items.removed': 'Duplicaten verwijderd',
    'spotifytop.heading': '🚀 Nieuw project, Musicalyst!',
    'spotifytop.description':
      'Heb je je ooit afgevraagd naar welke artiesten, liedjes of genres je de laatste tijd het vaakst op Spotify luistert?',
    'spotifytop.check1': 'Bekijk mijn nieuwe tool',
    'spotifytop.check2':
      'om een ​​verslag te zien van wat je onlangs op Spotify hebt afgespeeld.',
    'faq.section-title': "Veel gestelde vragen",
    'faq.question-1': 'Wat doet deze webapplicatie?',
    'faq.answer-1': 'Spotify Dedup helpt je bij het opschonen van je muziekbibliotheken op Spotify door dubbele nummers in afspeellijsten en opgeslagen nummers te identificeren en te verwijderen.',
    'faq.question-2': 'Hoe vindt deze tool duplicaten?',
    'faq.answer-2': 'De tool vindt duplicaten op basis van de nummeridentificatie, titel, artiest en gelijkenis in duur. Het identificeert duplicaten die de applicatie van Spotify niet kan vinden.',
    'faq.question-3': 'Hoe is deze tool beter dan de dubbele detectie van Spotify?',
    'faq.answer-3': 'Hetzelfde nummer kan meerdere identifiers hebben op Spotify, zowel in dezelfde release als in meerdere. Spotify waarschuwt alleen voor duplicaten op basis van de nummeridentificatie, terwijl deze tool ook duplicaten detecteert op basis van titel, artiest en gelijkenis in duur.',
    'faq.question-4': 'Als er duplicaten worden gevonden, welke nummers worden dan verwijderd?',
    'faq.answer-4': 'Dedup houdt het eerste nummer binnen een groep dubbele nummers en verwijdert de rest.',
    'faq.question-5': 'Is mijn data veilig met deze webapplicatie?',
    'faq.answer-5': 'Ja, deze webapplicatie slaat geen gebruikersgegevens op zijn servers op. Het vraagt alleen de minimale set rechten die nodig zijn om je bibliotheek te verwerken.',
    'faq.question-6': 'Welke rechten heeft deze webapplicatie nodig?',
    'faq.answer-6': 'Deze webapplicatie gebruikt de authenticatieservice van Spotify om toegang te krijgen tot je opgeslagen nummers en afspeellijsten in je bibliotheek.',
    'faq.question-7': 'Hoe is deze tool getest?',
    'faq.answer-7': 'Deze tool is getest door duizenden gebruikers die het sinds 2014 hebben gebruikt om duplicaten in miljoenen afspeellijsten te identificeren.',
    'faq.question-8': 'Kan deze tool duplicaten van meerdere afspeellijsten verwijderen?',
    'faq.answer-8': 'Deze tool kan duplicaten van alle afspeellijsten in een bibliotheek identificeren en verwijderen, maar detecteert geen duplicaten van een nummer in meerdere afspeellijsten.',
    'faq.question-9': 'Hoe kan ik de machtigingen voor deze webapplicatie intrekken?',
    'faq.answer-9': 'Gebruikers kunnen de machtigingen die aan deze webapplicatie zijn verleend op elk moment intrekken op uw Spotify-account, onder de sectie \'Apps\'.',
    'faq.question-10': 'Werkt deze tool met andere muziekstreamingdiensten?',
    'faq.answer-10': 'Nee, deze tool werkt alleen met Spotify en gebruikt de Web API van Spotify om duplicaten in je bibliotheek te identificeren en te verwijderen.'
  });
  i18n.changeLanguage('nl');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
