import promisesForPages from './promiseForPages';
import SpotifyWebApi from './spotifyApi';

export const fetchUserOwnedPlaylists = async (
  api: SpotifyWebApi,
  userId: string
) => {
  const pages = await promisesForPages(
    api,
    api.getUserPlaylists(userId, { limit: 50 })
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
