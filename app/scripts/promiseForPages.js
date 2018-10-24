export default async function promisesForPages(initialRequest, api) {
  function stripParameters(href) {
    return href.indexOf('?') !== -1 ? href.substr(0, href.indexOf('?')) : href;
  }

  async function fetchGeneric(results, offset, limit) {
    return api.getGeneric(
      `${stripParameters(results.href)}?offset=${offset}&limit=${limit}`
    );
  }

  const results = await initialRequest;
  if (results === null) {
    return [];
  }

  const promises = [() => initialRequest];
  let offset = results.limit + results.offset;
  const limit = results.limit;
  while (results.total > offset) {
    (function(results, offset, limit) {
      const q = () => {
        return new Promise(async resolve => {
          try {
            const result = await fetchGeneric(results, offset, limit).catch(
              e => {
                console.error(
                  `Error making request to fetch tracks from ${
                    results.href
                  } with offset ${offset} and limit ${limit}`,
                  e
                );
                resolve({ items: new Array(limit) });
              }
            );
            resolve(result);
          } catch (e) {
            console.error(e);
          }
        });
      };
      promises.push(q);
    })(results, offset, limit);
    offset += limit;
  }

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
