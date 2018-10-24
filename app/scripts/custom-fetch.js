const timeoutBetweenFailingRequests = 2000;
const queue = [];
let isOngoingRequest = false;

async function execute({ promise, resolve, reject, url, options, retries }) {
  try {
    const response = await fetch(url, options);
    let success = response.status < 400;
    if (!success) {
      console.log(
        'got status ' + response.status + ' with retries ' + retries,
        url,
        options
      );
    }
    if (success) {
      resolve(response);
    } else if (--retries > 0) {
      setTimeout(() => {
        execute({ promise, resolve, reject, url, options, retries });
      }, timeoutBetweenFailingRequests + Math.random() * 5000);
    } else {
      reject(response);
    }
  } catch (e) {
    if (--retries > 0) {
      setTimeout(() => {
        execute({ promise, resolve, reject, url, options, retries });
      }, timeoutBetweenFailingRequests + Math.random() * 2000);
    } else {
      reject(e);
    }
  }
}

async function tryToExecute() {
  if (!isOngoingRequest && queue.length > 0) {
    isOngoingRequest = true;
    const next = queue.shift();
    execute({
      promise: next.promise,
      resolve: next.resolve,
      reject: next.reject,
      url: next.url,
      options: next.options,
      retries: next.retries,
    });
  }
}

async function customFetch(url, options) {
  let retries = 3;

  const promise = new Promise((resolve, reject) => {
    queue.push({ promise: null, resolve, reject, url, options, retries });
  });

  tryToExecute();

  promise.then(r => {
    isOngoingRequest = false;
    tryToExecute();
  });

  return promise;
}

export default customFetch;
