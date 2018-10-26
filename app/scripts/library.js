import promisesForPages from './promiseForPages';

export const fetchUserOwnedPlaylists = async (api, user) => {
  const pages = await promisesForPages(
    api,
    api.getUserPlaylists(user, { limit: 50 })
  );

  return pages.reduce(
    (array, currentPage) =>
      array.concat(
        currentPage.items.filter(playlist => playlist.owner.id === user)
      ),
    []
  );
};
