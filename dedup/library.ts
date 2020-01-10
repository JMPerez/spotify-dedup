import promisesForPages from './promiseForPages';

export const fetchUserOwnedPlaylists = async (api, userId: String) => {
  const pages = await promisesForPages(
    api,
    api.getUserPlaylists(userId, { limit: 50 })
  );

  return pages.reduce(
    (array, currentPage) =>
      array.concat(
        currentPage.items.filter(
          playlist => playlist && playlist.owner.id === userId
        )
      ),
    []
  );
};
