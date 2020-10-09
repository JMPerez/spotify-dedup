import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('it', 'translation', {
    'menu.link-home': 'Home',
    'home.title': 'Spotify Deduplicatore',
    'home.description':
      'Elimina le tracce duplicate dalle tue playlist e dalle canzoni salvate.',
    'home.login-button': 'Accedi con Spotify',
    'meta.title':
      'Spotify Dedup - Elimina automaticamente tracce duplicate dalla tua libreria di Spotify',
    'meta.description':
      'Cancella le tracce ripetute dalle tue playlist di Spotify in maniera facile e veloce',
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
    'process.processing':
      'Sto cercando eventuali tracce duplicate, aspetta un momento. Devo processare ancora {{count}} playlist…',
    'process.processing_plural':
      'Sto cercando eventuali tracce duplicate, aspetta un momento. Devo processare ancora {{count}} playlist…',
    'process.saved.title': 'Canciones favoritas en tu biblioteca',
    'process.saved.duplicates':
      'Questa collezione contiene {{count}} traccia doppia',
    'process.saved.duplicates_plural':
      'Questa collezione contiene {{count}} tracce doppie',
    'process.saved.remove-button':
      'Elimino le tracce doppie fra le canzoni preferite',
    'process.playlist.duplicates':
      'Questa playlist contiene {{count}} traccia doppia',
    'process.playlist.duplicates_plural':
      'Questa playlist contiene {{count}} tracce doppie',
    'process.playlist.remove-button':
      'Elimino le tracce doppie eda questa playlist',
    'process.items.removed': 'Tracce doppie eliminate',
  });
  i18n.changeLanguage('it');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
