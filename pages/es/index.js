import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('es', 'translation', {
    'menu.link-home': 'Principal',
    'home.title': 'Deduplicador Spotify',
    'home.description':
      'Elimina canciones duplicadas de tus playlists y canciones guardadas.',
    'home.login-button': 'Iniciar sesión con Spotify',
    'meta.title':
      'Spotify Dedup - Elimina canciones duplicadas de tu biblioteca de Spotify automáticamente',
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
    'process.processing':
      'Buscando canciones duplicadas, espera un momento. Queda {{count}} playlist por procesar…',
    'process.processing_plural':
      'Buscando canciones duplicadas, espera un momento. Quedan {{count}} playlists por procesar…',
    'process.saved.title': 'Canciones favoritas en tu biblioteca',
    'process.saved.duplicates':
      'Esta colección tiene {{count}} canción duplicada',
    'process.saved.duplicates_plural':
      'Esta colección tiene {{count}} canciones duplicadas',
    'process.saved.remove-button': 'Eliminar duplicados en canciones favoritas',
    'process.playlist.duplicates':
      'Esta playlist tiene {{count}} canción duplicada',
    'process.playlist.duplicates_plural':
      'Esta playlist tiene {{count}} canciones duplicadas',
    'process.playlist.remove-button': 'Eliminar duplicados de esta playlist',
    'process.items.removed': 'Duplicados eliminados',
  });
  i18n.changeLanguage('es');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
