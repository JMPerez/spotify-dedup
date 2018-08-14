import fetch from './custom-fetch';
export default async function promisesForPages(
  initialRequest,
  promiseThrottle,
  api
) {
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
      console.log(offset, limit);
      const q = () => fetchGeneric(results, offset, limit);
      promises.push(q);
    })(results, offset, limit);
    offset += limit;
  }

  return promises.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );
}
