function stripParameters(href) {
  return href.indexOf('?') !== -1 ? href.substr(0, href.indexOf('?')) : href;
}

async function fetchGeneric(api, href, offset, limit) {
  return api.getGeneric(
    `${stripParameters(href)}?offset=${offset}&limit=${limit}`
  );
}

async function fetchPageWithDefaults(api, href, offset, limit) {
  let result;
  try {
    result = await fetchGeneric(api, href, offset, limit);
  } catch (e) {
    // todo: report this in the UI somehow
    /* console.error(
      `Error making request to fetch tracks from ${href} with offset ${offset} and limit ${limit}`,
      e
    );*/
    result = { items: new Array(limit).fill(null) };
  }
  return result;
}

export default async function promisesForPages(api, initialRequest) {
  const results = await initialRequest;
  if (results === null) {
    return [];
  }

  const { limit, total, offset, href } = results;
  if (total === 0) {
    return Promise.resolve([]);
  }
  const promises = new Array(Math.ceil((total - limit - offset) / limit))
    .fill('')
    .reduce(
      (prev, _, currentIndex) => {
        prev.push(() =>
          fetchPageWithDefaults(
            api,
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
