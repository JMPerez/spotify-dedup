import '../../i18n';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('es', 'translation', {
    'menu.link-home': 'Principal',
    'menu.link-stats': 'Estadísticas',
    'home.title': 'Elimina canciones duplicadas de tu biblioteca de Spotify.',
    'home.description':
      'Spotify Dedup limpia tus playlists y canciones de tu cuenta de Spotify. Es fácil y rápido.',
    'home.login-button': 'Iniciar sesión con Spotify',
    'home.review': 'Lee lo que {{-supportersCount}} seguidores piensan sobre Spotify Dedup en {{- linkOpen}}Buy Me a Coffee{{- linkClose}}',
    'meta.title':
      'Dedup - Elimina canciones duplicadas de tu biblioteca de Spotify',
    'meta.description':
      'Elimina canciones repetidas de tus listas de reproducción de Spotify y canciones favoritas de una forma rápida y sencilla.',
    'features.find-remove.header': 'Busca y elimina',
    'features.find-remove.body':
      'Dedup comprueba tus playlists y canciones guardadas en {{- strongOpen}}tu biblioteca de Spotify{{- strongClose}}. Una vez que Dedup encuentra duplicados los puedes eliminar playlist a playlist.',
    'features.safer.header': 'Seguro',
    'features.safer.body':
      'Dedup sólo elimina {{- strongOpen}}canciones duplicadas{{- strongClose}}, dejando el resto de la lista de reproducción y colección de canciones guardadas intactos.',
    'features.open-source.header': 'Código abierto',
    'features.open-source.body':
      'Puedes echar un ojo al {{- linkGithubOpen}}código fuente en GitHub{{- linkGithubClose}}. Esta aplicación web usa la {{- linkWebApiOpen}}Web API de Spotify{{- linkWebApiClose}} para gestionar las playlists y canciones guardadas del usuario.',
    'reviews.title': 'Esto es lo que dicen los usuarios',
    'footer.author': 'Hecho con ♥ por {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github': 'Mira el {{- linkOpen}}código en GitHub 📃{{- linkClose}}',
    'footer.musicalyst': 'Echa un vistazo a {{- linkOpen}}Musicalyst 🎧{{- linkClose}}',
    'footer.bmc':
      'Apoya el proyecto {{- linkOpen}}comprando un café ☕{{- linkClose}}',
    'bmc.button': '¿Me compras un café?',
    'result.duplicate.reason-same-id': 'Duplicado',
    'result.duplicate.reason-same-data':
      'Duplicado (mismo nombre, artista y duración)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>de</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Buscando duplicados en tus listas de reproducción y canciones favoritas…',
    'process.status.complete': '¡Procesado completado!',
    'process.status.complete.body':
      '¡Tus playlists y canciones favoritas han sido procesadas!',
    'process.status.complete.dups.body':
      'Haz click en el botón {{- strongOpen}}Eliminar duplicados{{- strongClose}} para borrar las canciones duplicadas de esa lista de reproducción o colección.',
    'process.status.complete.nodups.body':
      '¡Enhorabuena! No tienes duplicados en tus listas de reproducción ni en tus canciones favoritas.',
    'process.reading-library':
      'Recorriendo tu biblioteca, encontrando las playlists creadas por ti y tus canciones favoritas…',
    'process.processing_one':
      'Buscando canciones duplicadas, espera un momento. Queda {{count}} playlist por procesar…',
    'process.processing_other':
      'Buscando canciones duplicadas, espera un momento. Quedan {{count}} playlists por procesar…',
    'process.saved.title': 'Canciones favoritas en tu biblioteca',
    'process.saved.duplicates_one':
      'Esta colección tiene {{count}} canción duplicada',
    'process.saved.duplicates_other':
      'Esta colección tiene {{count}} canciones duplicadas',
    'process.saved.remove-button': 'Eliminar duplicados en canciones favoritas',
    'process.playlist.duplicates_one':
      'Esta playlist tiene {{count}} canción duplicada',
    'process.playlist.duplicates_other':
      'Esta playlist tiene {{count}} canciones duplicadas',
    'process.playlist.remove-button': 'Eliminar duplicados de esta playlist',
    'process.items.removed': 'Duplicados eliminados',
    "faq.section-title": "Preguntas frecuentes",
    "faq.question-1": "¿Qué hace esta aplicación web?",
    "faq.answer-1": "Spotify Dedup te ayuda a limpiar tu bibliteca de Spotify identificando y eliminando canciones duplicadas en listas de reproducción y canciones guardadas.",
    "faq.question-2": "¿Cómo encuentra esta herramienta duplicados?",
    "faq.answer-2": "Spotify Dedup encuentra duplicados basándose en el identificador de la canción, la similitud en el título, el artista y la duración. Identifica duplicados que la aplicación de Spotify no detecta.",
    "faq.question-3": "¿Qué diferencia hay con la detección de duplicados de la app de Spotify?",
    "faq.answer-3": "La misma canción en Spotify tiene distintos identificadores dependiendo del país o territorio y release. Spotify solo advierte sobre duplicados basados en el identificador de la canción, mientras que esta herramienta también detecta duplicados basados en la similitud del título, artista y duración.",
    'faq.question-4': 'Cuando se encuentran duplicados, ¿qué canciones se eliminan?',
    'faq.answer-4': 'Dedup mantendrá la primera canción dentro de un grupo de canciones duplicadas y eliminará el resto.',
    "faq.question-5": "¿Está segura mi información con esta aplicación web?",
    "faq.answer-5": "Sí, esta aplicación web no almacena datos de usuario en sus servidores. Solo solicita el conjunto mínimo de permisos necesarios para procesar la biblioteca del usuario.",
    "faq.question-6": "¿Qué permisos requiere esta aplicación web?",
    "faq.answer-6": "Esta aplicación web utiliza el servicio de autenticación de Spotify para solicitar el conjunto mínimo de permisos necesarios para procesar la biblioteca del usuario.",
    "faq.question-7": "¿Cómo ha sido probada esta herramienta?",
    "faq.answer-7": "Esta herramienta ha sido usada por miles de usuarios para identificar duplicados en millones de listas de reproducción desde 2014.",
    "faq.question-8": "¿Puede esta herramienta eliminar duplicados en varias listas de reproducción?",
    "faq.answer-8": "Esta herramienta puede identificar y eliminar duplicados en todas las listas de reproducción de una biblioteca, pero no detecta duplicados de una canción en varias listas de reproducción.",
    "faq.question-9": "¿Cómo puedo revocar los permisos otorgados a esta aplicación web?",
    "faq.answer-9": "Puedes revocar los permisos dados a esta aplicación web en cualquier momento en tu cuenta de Spotify, en la sección 'Aplicaciones'.",
    "faq.question-10": "¿Funciona esta herramienta con otros servicios de streaming?",
    "faq.answer-10": "No, esta herramienta solo funciona con Spotify y utiliza la API web de Spotify para identificar y eliminar duplicados en la biblioteca del usuario."
  });
  i18n.changeLanguage('es');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
