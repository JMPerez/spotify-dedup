export default async function promisesForPages(initialRequest, api) {
  function stripParameters(href) {
    return href.indexOf('?') !== -1 ? href.substr(0, href.indexOf('?')) : href;
  }

  async function fetchGeneric(href, offset, limit) {
    return api.getGeneric(
      `${stripParameters(href)}?offset=${offset}&limit=${limit}`
    );
  }

  async function fetchPageWithDefaults(href, offset, limit) {
    let result;
    try {
      result = await fetchGeneric(href, offset, limit);
    } catch (e) {
      console.error(
        `Error making request to fetch tracks from ${href} with offset ${offset} and limit ${limit}`
      );
      result = { items: new Array(limit).fill(null) };
    }
    return result;
  }

  const results = await initialRequest;
  if (results === null) {
    return [];
  }

  const { limit, total, offset, href } = results;
  const promises = new Array(Math.ceil((total - limit - offset) / limit))
    .fill('')
    .reduce(
      (prev, current, currentIndex) => {
        prev.push(() =>
          fetchPageWithDefaults(
            href,
            limit + offset + currentIndex * limit,
            limit
          )
        );
        return prev;
      },
      [() => initialRequest]
    );

  return promises.reduce(
    (promise, func) =>
      promise
        .then(result =>
          func()
            .then(Array.prototype.concat.bind(result))
            .catch(e => {
              console.error(e);
            })
        )
        .catch(e => {
          console.error(e);
        }),
    Promise.resolve([])
  );
}
