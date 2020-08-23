/**
 * Custom Fetch is a fetcher that queues and retries requests
 *
 * Every time `customFetch` is called, it queues the request and it
 * gets executed when the previous ones have finalised. It also adds
 * a delay before retrying requests.
 */

type QueuedFetchType = {
  resolve: any;
  reject: (error: ErrorType) => void;
  url: string;
  options: RequestInit;
  retries: number;
};

type ErrorType = {
  message: string;
  url: string;
  options: RequestInit;
};

const retries = 3;
const timeoutBetweenFailingRequests = {
  min: 2000,
  max: 5000,
};
const queue: Array<QueuedFetchType> = [];
let ongoingFetch = null;

async function execute(entry: QueuedFetchType) {
  let shouldRetry = false;
  try {
    const response = await fetch(entry.url, entry.options);
    let success = response.status < 400;
    if (success) {
      entry.resolve(response);
    } else {
      console.error('Got status ' + response.status, entry);
      if (--entry.retries > 0) {
        shouldRetry = true;
      } else {
        entry.reject({
          message: 'Too many retries',
          url: entry.url,
          options: entry.options,
        });
      }
    }
  } catch (e) {
    if (--entry.retries > 0) {
      shouldRetry = true;
    } else {
      entry.reject({
        message: e.message,
        url: entry.url,
        options: entry.options,
      });
    }
  }
  if (shouldRetry) {
    setTimeout(() => {
      execute(entry);
    }, timeoutBetweenFailingRequests.min + Math.random() * (timeoutBetweenFailingRequests.max - timeoutBetweenFailingRequests.min));
  }
}

async function tryToExecute() {
  if (!ongoingFetch && queue.length > 0) {
    const next = queue.shift();
    ongoingFetch = next;
    execute(next);
  }
}

async function customFetch(fetchParams: {
  url: string;
  options?: { [key: string]: any };
}): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    queue.push({
      resolve,
      reject,
      url: fetchParams.url,
      options: fetchParams.options,
      retries: retries,
    });
  });

  // we try to execute a fetch when it gets queued
  tryToExecute();

  promise.then(() => {
    ongoingFetch = null;
    // we try to execute a fetch when a previous fetch has finalised
    tryToExecute();
  });

  return promise;
}

export default customFetch;
