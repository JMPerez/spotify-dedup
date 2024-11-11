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
  let result: PaginableResultType;

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
      next: '',
      previous: '',
      total: 0,
    };
  }
  return result;
}

export default async function promisesForPages(
  api: SpotifyWebApi,
  initialRequest,
  onProgressChanged: (progress: number) => void,
  onError?: (error: Error) => boolean,
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
  // https://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence
  let fulfilledPromises = 0;
  return promises.reduce(
    (previousPromise, currentPromise) =>
      previousPromise
        .then((result: Array<Object>) => {
          onProgressChanged && onProgressChanged(1.0 * (++fulfilledPromises / promises.length));
          return currentPromise()
            .then((currentResult) => {
              return currentResult ? result.concat(currentResult) : result;
            })
            .catch((e) => {
              console.error('There was an error reducing promises', e);

              // If onError is provided, let it decide whether to continue
              if (onError) {
                const shouldContinue = onError(e);
                if (!shouldContinue) {
                  throw e; // This will break the chain
                }
              }

              // Continue with previous results if no onError or if it returned true
              return result;
            });
        })
        .catch((e) => {
          console.error(
            'There was an error reducing promises - general catch',
            e
          );
          throw e; // Re-throw to stop the chain if we got here
        }),
    Promise.resolve([])
  );
}
