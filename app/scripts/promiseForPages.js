export default async function promisesForPages(promise, promiseThrottle, api) {
  function stripParameters(href) {
    return href.indexOf('?') !== -1 ? href.substr(0, href.indexOf('?')) : href;
  }

  async function fetchGeneric(results, offset, limit) {
    return api.getGeneric(
      `${stripParameters(results.href)}?offset=${offset}&limit=${limit}`
    );
  }

  const results = await promise;
  if (results === null) {
    return [];
  }
  const promises = [promise];
  let offset = results.limit + results.offset;
  const limit = results.limit;
  while (results.total > offset) {
    const q = promiseThrottle.add(
      fetchGeneric.bind(this, results, offset, limit)
    );
    promises.push(q);
    offset += limit;
  }
  return promises;
}
