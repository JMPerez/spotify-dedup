import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('fr', 'translation', {
    'menu.link-home': "Page d'accueil",
    'home.title': 'Déduplicateur Spotify',
    'home.description':
      'Supprimez les chansons en double de vos listes de lecture et chansons enregistrées.',
    'home.login-button': 'Se connecter avec Spotify',
    'meta.title':
      'Spotify Dedup - Supprimer automatiquement les chansons en double de votre bibliothèque Spotify',
    'meta.description':
      'Supprimez rapidement et facilement des chansons répétées de vos listes de lecture Spotify et de vos chansons préférées.',
    'features.find-remove.header': 'Rechercher et supprimer',
    'features.find-remove.body':
      'Dedup vérifiez vos listes de lecture et vos chansons enregistrées dans {{- strongOpen}}votre bibliothèque Spotify{{- strongClose}}. Une fois que Dedup trouve des doublons, vous pouvez les supprimer de playlist en playlist.',
    'features.safer.header': 'Sûr',
    'features.safer.body':
      'Dedup supprime uniquement {{- strongOpen}}les chansons en double{{- strongClose}}, laissant le reste de la liste de lecture et la collection de chansons enregistrées intactes.',
    'features.open-source.header': 'Open source',
    'features.open-source.body':
      "Vous pouvez jeter un œil au {{- linkGithubOpen}}code source sur GitHub{{- linkGithubClose}}. Cette application Web utilise {{- linkWebApiOpen}}l'API Web Spotify{{- linkWebApiClose}} pour gérer les listes de lecture et les morceaux enregistrés de l'utilisateur.",
    'reviews.title': 'Voici ce que disent les utilisateurs',
    'footer.author': 'Fait avec ♥ pour {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github':
      'Regardez le {{- linkOpen}}code sur GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Soutenez le projet {{- linkOpen}}en achetant un café ☕{{- linkClose}}',
    'bmc.button': 'Achetez-moi un café',
    'result.duplicate.reason-same-id': 'Dupliqué',
    'result.duplicate.reason-same-data':
      'Dupliqué (même nom, artiste et durée)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>de</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Recherche de doublons dans vos listes de lecture et chansons préférées…',
    'process.status.complete': 'Traitement terminé!',
    'process.status.complete.body':
      'Vos listes de lecture et chansons préférées ont été traitées!',
    'process.status.complete.dups.body':
      'Cliquez sur le bouton {{- strongOpen}}Supprimer les doublons{{- strongClose}} pour supprimer les chansons en double de cette liste de lecture ou collection.',
    'process.status.complete.nodups.body':
      "Félicitations! Vous n'avez aucun doublon dans vos listes de lecture ou dans vos chansons préférées.",
    'process.reading-library':
      'Visite de votre bibliothèque, recherche des listes de lecture créées par vous et de vos chansons préférées…',
    'process.processing':
      'À la recherche de chansons en double, attendez un instant. {{count}} liste de lecture manquante à traiter…',
    'process.processing_plural':
      'À la recherche de chansons en double, attendez un instant. {{count}} listes de lecture manquantes à traiter…',
    'process.saved.title': 'Chansons préférées dans votre bibliothèque',
    'process.saved.duplicates':
      'Cette collection contient {{count}} chanson en double',
    'process.saved.duplicates_plural':
      'Cette collection contient {{count}} chansons en double',
    'process.saved.remove-button': 'Supprimer les doublons',
    'process.playlist.duplicates':
      'Cette playlist contient {{count}} chanson en double',
    'process.playlist.duplicates_plural':
      'Cette playlist contient {{count}} chansons en double',
    'process.playlist.remove-button': 'Supprimer les doublons',
    'process.items.removed': 'Doublons supprimés',
  });
  i18n.changeLanguage('fr');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
