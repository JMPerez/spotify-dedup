/**
 * Promise for pages is an util function to concat all the
 * results for requests that require pagination from Spotify's Web API
 *
 */

import SpotifyWebApi from './spotifyApi';

type PaginableResultType = {
  items: Array<any>;
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

function stripParameters(href: string) {
  return href.indexOf('?') !== -1 ? href.substr(0, href.indexOf('?')) : href;
}

async function fetchGeneric(
  api: SpotifyWebApi,
  href: string,
  offset: number,
  limit: number
) {
  return api.getGeneric(
    `${stripParameters(href)}?offset=${offset}&limit=${limit}`
  );
}

async function fetchPageWithDefaults(
  api: SpotifyWebApi,
  href: string,
  offset: number,
  limit: number
) {
  let result: PaginableResultType = null;

  try {
    result = (await fetchGeneric(
      api,
      href,
      offset,
      limit
    )) as PaginableResultType;
  } catch (e) {
    // Fetching this page of results failed. We fill the chunk with null elements as a fallback.
    // todo: report this in the UI somehow
    console.error(
      `Error making request to fetch tracks from ${href} with offset ${offset} and limit ${limit}`,
      e
    );
    result = {
      items: new Array(limit).fill(null),
      href,
      offset,
      limit,
      next: null,
      previous: null,
      total: null,
    };
  }
  return result;
}

export default async function promisesForPages(
  api: SpotifyWebApi,
  initialRequest
): Promise<Array<any>> {
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

  // resolve promises sequentially
  return promises.reduce(
    (previousPromise, currentPromise) =>
      previousPromise
        .then((result: Array<Object>) =>
          currentPromise()
            .then(Array.prototype.concat.bind(result))
            .catch((e) => {
              console.error('There was an error reducing promises', e);
            })
        )
        .catch((e) => {
          console.error(
            'There was an error reducing promises - general catch',
            e
          );
        }),
    Promise.resolve([])
  );
}
