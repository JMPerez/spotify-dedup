import '../../i18n';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('it', 'translation', {
    'menu.link-home': 'Home',
    'menu.link-stats': 'Statistiche',
    'home.title': 'Spotify Deduplicatore',
    'home.description':
      'Elimina le tracce duplicate dalle tue playlist e dalle canzoni salvate.',
    'home.login-button': 'Accedi con Spotify',
    'home.review': 'Leggi cosa pensano {{-supportersCount}} sostenitori di Spotify Dedup su {{- linkOpen}}Buy Me a Coffee{{- linkClose}}.',
    'meta.title':
      'Dedup - Elimina tracce duplicate dalla tua libreria di Spotify',
    'meta.description':
      'Elimina rapidamente le tracce duplicate dalle tue playlist e dalle canzoni salvate su Spotify con Spotify Dedup. Semplice, veloce e senza stress!',
    'features.find-remove.header': 'Cerca e elimina',
    'features.find-remove.body':
      'Dedup ispeziona le liste e le canzoni salvate nella tua {{- strongOpen}}libreria di Spotify{{- strongClose}}. Una volta che rileva tracce duplicate ti permette di eliminarle da ciascuna playlist.',
    'features.safer.header': 'Sicuro',
    'features.safer.body':
      'Dedup elimina solamente le {{- strongOpen}}tracce duplicate{{- strongClose}}, senza toccare il resto della playlist e delle canzoni salvate.',
    'features.open-source.header': 'Open source',
    'features.open-source.body':
      "Puoi dare uno sguardo al {{- linkGithubOpen}}codice sorgente su GitHub{{- linkGithubClose}}. Questa applicazione utilizza le {{- linkWebApiOpen}}API Web di Spotify{{- linkWebApiClose}} per gestire le playlist e le canzoni salvate dell'utente.",
    'reviews.title': 'Questo è quello che ne pensano gli utenti',
    'footer.author': 'Fatto con ♥ da {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github':
      'Controlla il {{- linkOpen}}codice su GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Sostieni il progetto {{- linkOpen}}al costo di un caffè ☕{{- linkClose}}',
    'footer.musicalyst': "Dai un'occhiata a {{- linkOpen}}Musicalyst 🎧{{- linkClose}}",
    'bmc.button': 'Mi offri un caffè?',
    'result.duplicate.reason-same-id': 'Duplicato',
    'result.duplicate.reason-same-data':
      'Duplicato (stesso nome, artista e durata)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>di</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Cerco duplicati fra le tue playlist e canzoni preferite…',
    'process.status.complete': 'Procedura completata!',
    'process.status.complete.body':
      'Ho processato tutte le playlist e le canzoni salvate!',
    'process.status.complete.dups.body':
      'premi sul bottone {{- strongOpen}}Elimina duplicati{{- strongClose}} per eliminare le doppie tracce da questa lista o dalla collezione.',
    'process.status.complete.nodups.body':
      'Perfetto! Non ci sono duplicati fra le canzoni salvate e playlist.',
    'process.reading-library':
      'Analizzo la tua libreria, le playlist da te create e le tue canzoni preferite…',
    'process.processing_one':
      'Sto cercando eventuali tracce duplicate, aspetta un momento. Devo processare ancora {{count}} playlist…',
    'process.processing_other':
      'Sto cercando eventuali tracce duplicate, aspetta un momento. Devo processare ancora {{count}} playlist…',
    'process.saved.title': 'Canciones favoritas en tu biblioteca',
    'process.saved.duplicates_one':
      'Questa collezione contiene {{count}} traccia doppia',
    'process.saved.duplicates_other':
      'Questa collezione contiene {{count}} tracce doppie',
    'process.saved.remove-button':
      'Elimino le tracce doppie fra le canzoni preferite',
    'process.playlist.duplicates_one':
      'Questa playlist contiene {{count}} traccia doppia',
    'process.playlist.duplicates_other':
      'Questa playlist contiene {{count}} tracce doppie',
    'process.playlist.remove-button':
      'Elimina le tracce doppie da questa playlist',
    'process.items.removed': 'Tracce doppie eliminate',
    'faq.section-title': "Domande frequenti",
    'faq.question-1': 'Cosa fa questa applicazione web?',
    'faq.answer-1': 'Spotify Dedup ti aiuta a ripulire le tue librerie musicali su Spotify identificando ed eliminando i brani duplicati nelle playlist e nei brani salvati.',
    'faq.question-2': 'In che modo questo strumento trova i duplicati?',
    'faq.answer-2': 'Lo strumento trova i duplicati in base all\'identificatore del brano, al titolo, all\'artista e alla somiglianza della durata. Identifica i duplicati che l\'applicazione di Spotify non trova.',
    'faq.question-3': 'In che modo questo strumento è migliore del rilevamento duplicati di Spotify?',
    'faq.answer-3': ' La stessa canzone può avere più identificatori su Spotify sia nella stessa versione che in più versioni. Spotify avvisa solo dei duplicati in base all\'identificatore del brano, mentre questo strumento rileva anche i duplicati in base al titolo, all\'artista e alla somiglianza della durata.',
    'faq.question-4': 'Quando vengono trovati duplicati, quali brani vengono rimossi?',
    'faq.answer-4': 'Dedup manterrà il primo brano all\'interno di un gruppo di brani duplicati e rimuoverà il resto.',
    'faq.question-5': 'I miei dati sono al sicuro con questa applicazione web?',
    'faq.answer-5': 'Sì, questa applicazione web non memorizza alcun dato utente sui propri server. Richiede solo il set minimo di autorizzazioni necessarie per elaborare la tua libreria.',
    'faq.question-6': 'Quali autorizzazioni richiede questa applicazione web?',
    'faq.answer-6': 'Questa applicazione web utilizza il servizio di autenticazione di Spotify per accedere alle tracce e alle playlist salvate nella tua libreria.',
    'faq.question-7': 'Come è stato testato questo strumento?',
    'faq.answer-7': 'Questo strumento è stato testato sul campo da migliaia di utenti che lo hanno utilizzato per identificare i duplicati in milioni di playlist dal 2014.',
    'faq.question-8': 'Questo strumento può eliminare i duplicati in più playlist?',
    'faq.answer-8': 'Questo strumento può identificare ed eliminare i duplicati su tutte le playlist in una libreria, ma non rileva i duplicati di un brano in più playlist.',
    'faq.question-9': 'Come posso revocare i permessi concessi a questa applicazione web?',
    'faq.answer-9': 'Gli utenti possono revocare le autorizzazioni concesse a questa applicazione web in qualsiasi momento sul proprio account Spotify, nella sezione \'App\'.',
    'faq.question-10': 'Questo strumento funziona con altri servizi di streaming musicale?',
    'faq.answer-10': 'No, questo strumento funziona solo con Spotify e utilizza l\'API Web di Spotify per identificare ed eliminare i duplicati nella tua libreria.',
    // matching settings (UI)
    'matching-settings.title': 'Impostazioni rilevamento duplicati (opzionale)',
    'matching-settings.enable-name-artist.title': 'Abbina per titolo, artista e differenza di durata',
    'matching-settings.enable-name-artist.help': 'Se abilitato, gli elementi con lo stesso titolo del brano, artista principale e durata simile vengono considerati duplicati.',
    'matching-settings.duration-threshold.label': 'Soglia differenza durata (secondi)',
    'matching-settings.duration-threshold.help': 'Considerati uguali se la differenza di durata è inferiore a questo valore.'
  });
  i18n.changeLanguage('it');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
