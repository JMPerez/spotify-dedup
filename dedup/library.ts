import SpotifyWebApi from './spotifyApi';
import promisesForPages from './promiseForPages';

export const fetchUserOwnedPlaylists = async (
  api: SpotifyWebApi,
  userId: string,
  onProgressChanged: (progress: number) => void,
) => {
  const pages = await promisesForPages(
    api,
    api.getUserPlaylists(userId, { limit: 50 }),
    onProgressChanged
  );

  return pages.reduce(
    (array, currentPage) =>
      array.concat(
        currentPage.items.filter(
          (playlist) => playlist && playlist.owner.id === userId
        )
      ),
    []
  );
};
