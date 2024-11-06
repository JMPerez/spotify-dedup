interface RetryOptions {
  times?: number;
  delay?: number;
  backoff?: number;
  onError?: (error: Error, attempt: number) => void;
  showDefaultAlert?: boolean;
}

class RetryFetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public requestInfo?: string,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'RetryFetchError';
  }
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const calculateDelay = (
  baseDelay: number,
  backoff: number,
  attempt: number,
  retryAfter?: number
): number => {
  // If we have a Retry-After header, use that instead of our calculated delay
  if (retryAfter) {
    return retryAfter * 1000; // Convert seconds to milliseconds
  }
  return baseDelay * Math.pow(backoff, attempt - 1);
};

async function makeAttempt(
  input: RequestInfo,
  fetchOptions: RequestInit,
  attempt: number,
  onError?: (error: Error, attempt: number) => void
): Promise<Response> {
  try {
    const response = await fetch(input, fetchOptions);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RetryFetchError(
        'Rate limited',
        429,
        input.toString(),
        retryAfter ? parseInt(retryAfter) : undefined
      );
    }

    if (response.ok) {
      return response;
    }

    throw new RetryFetchError(
      'Failed fetch',
      response.status,
      input.toString()
    );
  } catch (error) {
    if (onError) {
      onError(error as Error, attempt);
    } else {
      console.warn(`Fetch attempt ${attempt} failed:`, error);
    }
    throw error;
  }
}

async function handleFinalError(
  error: Error,
  input: RequestInfo,
  showDefaultAlert: boolean
): Promise<never> {
  console.warn('Max attempts reached');

  if (typeof global !== 'undefined' && global.sa_event) {
    const errorDetails = error instanceof RetryFetchError
      ? {
        message: error.message,
        statusCode: error.statusCode,
        requestInfo: error.requestInfo
      }
      : { message: error.message };

    global.sa_event('error_api_max_retries', errorDetails);
  }

  if (showDefaultAlert) {
    alert(
      'There was an error accessing the API. Please try again later. ' +
      'If the problem persists, please report this issue.'
    );
  }

  throw error;
}

export async function retryFetch(
  input: RequestInfo,
  init?: RequestInit & RetryOptions
): Promise<Response> {
  const {
    times = 3,
    delay = 1000,
    backoff = 1.3,
    onError,
    showDefaultAlert = true,
    ...fetchOptions
  } = init || {};

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await makeAttempt(input, fetchOptions, attempt, onError);
    } catch (error) {
      lastError = error as Error;

      if (attempt < times) {
        const retryAfter = (error instanceof RetryFetchError) ? error.retryAfter : undefined;
        const waitTime = calculateDelay(delay, backoff, attempt, retryAfter);
        console.debug(`Waiting ${waitTime}ms before attempt ${attempt + 1}`);
        await sleep(waitTime);
        continue;
      }
    }
  }

  return handleFinalError(
    lastError || new Error('Unknown error occurred'),
    input,
    showDefaultAlert
  );
}

export default retryFetch;