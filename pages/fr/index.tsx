import '../../i18n';

import { useTranslation } from 'react-i18next';
import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('fr', 'translation', {
    'menu.link-home': "Page d'accueil",
    'menu.link-stats': 'Statistiques',
    'home.title': 'Supprimez les chansons en double de votre bibliothèque Spotify.',
    'home.description':
      "Spotify Dedup nettoie vos listes de lecture et les chansons enregistrées de votre compte Spotify. C'est facile et rapide.",
    'home.login-button': 'Se connecter avec Spotify',
    'home.review': 'Lisez ce que {{-supportersCount}} supporters pensent de Spotify Dedup sur {{- linkOpen}}Buy Me a Coffee{{- linkClose}}.',
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
    'footer.musicalyst': 'Découvrez {{- linkOpen}}Musicalyst 🎧{{- linkClose}}',
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
    'process.processing_one':
      'À la recherche de chansons en double, attendez un instant. {{count}} liste de lecture manquante à traiter…',
    'process.processing_other':
      'À la recherche de chansons en double, attendez un instant. {{count}} listes de lecture manquantes à traiter…',
    'process.saved.title': 'Chansons préférées dans votre bibliothèque',
    'process.saved.duplicates_one':
      'Cette collection contient {{count}} chanson en double',
    'process.saved.duplicates_other':
      'Cette collection contient {{count}} chansons en double',
    'process.saved.remove-button': 'Supprimer les doublons',
    'process.playlist.duplicates_one':
      'Cette playlist contient {{count}} chanson en double',
    'process.playlist.duplicates_other':
      'Cette playlist contient {{count}} chansons en double',
    'process.playlist.remove-button': 'Supprimer les doublons',
    'process.items.removed': 'Doublons supprimés',
    'spotifytop.heading': '🚀 Nouveau projet, Musicalyst!',
    'spotifytop.description':
      'Vous vous demandez quels artistes, chansons ou genres vous avez le plus écoutés sur Spotify ces derniers temps?',
    'spotifytop.check1': 'Jetez un œil à mon nouvel outil',
    'spotifytop.check2':
      'pour voir un rapport de ce que vous avez joué récemment sur Spotify.',
    'faq.section-title': "Foire aux questions",
    'faq.question-1': 'Que fait cette application Web ?',
    'faq.answer-1': 'Spotify Dedup vous aide à nettoyer vos bibliothèques musicales sur Spotify en identifiant et en supprimant les chansons en double dans les listes de lecture et les chansons enregistrées.',
    'faq.question-2': 'Comment cet outil trouve-t-il les doublons ?',
    'faq.answer-2': 'L\'outil trouve les doublons en fonction de l\'identifiant des chansons, du titre, de l\'artiste et de la similarité de la durée. Il identifie les doublons que l\'application Spotify ne trouve pas.',
    'faq.question-3': 'En quoi cet outil est-il meilleur que la détection des doublons de Spotify ?',
    'faq.answer-3': ' Une même chanson peut avoir plusieurs identifiants sur Spotify que ce soit dans la même release ou dans plusieurs. Spotify avertit uniquement des doublons en fonction de l\'identifiant de la chanson, tandis que cet outil détecte également les doublons en fonction de la similarité du titre, de l\'artiste et de la durée.',
    'faq.question-4': 'Lorsque des doublons sont trouvés, quelles chansons sont supprimées ?',
    'faq.answer-4': 'Dedup conservera la première chanson dans un groupe de chansons en double et supprimera le reste.',
    'faq.question-5': 'Mes données sont-elles en sécurité avec cette application Web ?',
    'faq.answer-5': 'Oui, cette application Web ne stocke aucune donnée utilisateur sur ses serveurs. Il ne demande que l\'ensemble minimum d\'autorisations nécessaires pour traiter votre bibliothèque.',
    'faq.question-6': 'De quelles autorisations cette application Web a-t-elle besoin ?',
    'faq.answer-6': 'Cette application Web utilise le service d\'authentification de Spotify pour accéder à vos pistes et listes de lecture enregistrées dans votre bibliothèque.',
    'faq.question-7': 'Comment cet outil a-t-il été testé ?',
    'faq.answer-7': 'Cet outil a été testé par des milliers d\'utilisateurs qui l\'ont utilisé pour identifier les doublons dans des millions de listes de lecture depuis 2014.',
    'faq.question-8': 'Cet outil peut-il supprimer les doublons sur plusieurs listes de lecture ?',
    'faq.answer-8': 'Cet outil peut identifier et supprimer les doublons sur toutes les playlists d\'une bibliothèque, mais ne détecte pas les doublons d\'une chanson sur plusieurs playlists.',
    'faq.question-9': 'Comment puis-je révoquer les autorisations accordées à cette application Web ?',
    'faq.answer-9': 'Les utilisateurs peuvent révoquer à tout moment les autorisations accordées à cette application Web sur votre compte Spotify, dans la section \'Applications\'.',
    'faq.question-10': 'Cet outil fonctionne-t-il avec d\'autres services de streaming musical?',
    'faq.answer-10': 'Non, cet outil ne fonctionne qu\'avec Spotify et utilise l\'API Web de Spotify pour identifier et supprimer les doublons dans votre bibliothèque.'
  });
  i18n.changeLanguage('fr');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
