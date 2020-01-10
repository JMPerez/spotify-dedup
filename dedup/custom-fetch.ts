const timeoutBetweenFailingRequests = 2000;
const queue: Array<{
  resolve: any;
  reject: any;
  url: string;
  options: RequestInit;
  retries: number;
}> = [];

export type ResponseType = {
  text: () => string;
  status: number;
  ok: boolean;
};

let isOngoingRequest = false;

async function execute({ resolve, reject, url, options, retries }) {
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
        execute({ resolve, reject, url, options, retries });
      }, timeoutBetweenFailingRequests + Math.random() * 5000);
    } else {
      reject(response);
    }
  } catch (e) {
    if (--retries > 0) {
      setTimeout(() => {
        execute({ resolve, reject, url, options, retries });
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
      resolve: next.resolve,
      reject: next.reject,
      url: next.url,
      options: next.options,
      retries: next.retries,
    });
  }
}

async function customFetch(fetchParams: {
  url: string;
  options?: { [key: string]: any };
}): Promise<any> {
  let retries = 3;

  const promise = new Promise((resolve, reject) => {
    queue.push({
      resolve,
      reject,
      url: fetchParams.url,
      options: fetchParams.options,
      retries,
    });
  });

  tryToExecute();

  promise.then(r => {
    isOngoingRequest = false;
    tryToExecute();
  });

  return promise;
}

export default customFetch;
