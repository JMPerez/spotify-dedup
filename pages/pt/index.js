import { useTranslation } from 'react-i18next';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';

const IndexComponent = () => {
  const { t, i18n } = useTranslation();
  i18n.addResourceBundle('pt', 'translation', {
    'menu.link-home': 'Pagina inicial',
    'home.title': 'Desduplicador Spotify',
    'home.description':
      'Remova músicas duplicadas de suas listas de reprodução e músicas salvas.',
    'home.login-button': 'Entre com o Spotify',
    'meta.title':
      'Spotify Dedup - Remova músicas duplicadas da sua biblioteca Spotify automaticamente',
    'meta.description':
      'Remova músicas repetidas de suas listas de reprodução do Spotify e músicas favoritas de forma rápida e fácil.',
    'features.find-remove.header': 'Pesquisar e excluir',
    'features.find-remove.body':
      'Dedup verifica suas listas de reprodução e músicas armazenadas na {{- strongOpen}}sua biblioteca do Spotify{{- strongClose}}. Depois que ela encontrar duplicatas, você poderá removê-las da lista de reprodução.',
    'features.safer.header': 'Seguro',
    'features.safer.body':
      'Dedup remove apenas {{- strongOpen}}músicas duplicadas{{- strongClose}}, deixando o restante da lista de reprodução e coleção de músicas salvas intactas.',
    'features.open-source.header': 'Código aberto',
    'features.open-source.body':
      'Você pode dar uma olhada no {{- linkGithubOpen}}código fonte no GitHub{{- linkGithubClose}}. Este aplicativo da web usa a {{- linkWebApiOpen}}API da Web do Spotify{{- linkWebApiClose}} para gerenciar as playlists e as músicas salvas do usuário.',
    'reviews.title': 'É o que os usuários dizem',
    'footer.author': 'Feito com ♥ por {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
    'footer.github': 'Veja o {{- linkOpen}}código no GitHub 📃{{- linkClose}}',
    'footer.bmc':
      'Apoie o projeto {{- linkOpen}}comprando um café ☕{{- linkClose}}',
    'bmc.button': 'Você pode me comprar um café?',
    'result.duplicate.reason-same-id': 'Duplicado',
    'result.duplicate.reason-same-data':
      'Duplicado (mesmo nome, artista e duração)',
    'result.duplicate.track':
      '<0>{{trackName}}</0> <2>de</2> <4>{{trackArtistName}}</4>',
    'process.status.finding':
      'Procurando duplicatas em suas listas de reprodução e músicas favoritas…',
    'process.status.complete': 'Processamento concluído!',
    'process.status.complete.body':
      'Suas listas de reprodução e músicas favoritas foram processadas!',
    'process.status.complete.dups.body':
      'Clique no botão {{- strongOpen}}Remover duplicatas{{- strongClose}} para excluir músicas duplicadas dessa lista de reprodução ou coleção.',
    'process.status.complete.nodups.body':
      'Parabéns! Você não tem duplicatas em suas listas de reprodução ou em suas músicas favoritas.',
    'process.reading-library':
      'Processando sua biblioteca, localizando as playlists criadas por você e suas músicas favoritas…',
    'process.processing':
      'Procurando músicas duplicadas, espere um momento. Falta {{count}} lista de reprodução para processar…',
    'process.processing_plural':
      'Procurando músicas duplicadas, espere um momento. Restam {{count}} listas de reprodução para processar…',
    'process.saved.title': 'Músicas favoritas da sua biblioteca',
    'process.saved.duplicates': 'Esta coleção tem {{count}} música duplicada',
    'process.saved.duplicates_plural':
      'Esta coleção tem {{count}} músicas duplicadas',
    'process.saved.remove-button': 'Remova duplicatas das músicas favoritas',
    'process.playlist.duplicates':
      'Esta lista de reprodução tem {{count}} música duplicada',
    'process.playlist.duplicates_plural':
      'Esta lista de reprodução tem {{count}} músicas duplicadas',
    'process.playlist.remove-button':
      'Remova duplicatas desta lista de reprodução',
    'process.items.removed': 'Duplicatas removidas',
  });
  i18n.changeLanguage('pt');
  return (
    <Page>
      <Index />
    </Page>
  );
};

export default IndexComponent;
