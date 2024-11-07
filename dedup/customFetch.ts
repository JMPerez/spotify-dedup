interface SpotifyErrorResponse {
  error: {
    status: number;
    message: string;
  };
}

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
    public retryAfter?: number,
    public spotifyError?: SpotifyErrorResponse
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
  if (retryAfter) {
    return retryAfter * 1000;
  }
  return baseDelay * Math.pow(backoff, attempt - 1);
};

async function parseSpotifyError(response: Response): Promise<SpotifyErrorResponse | null> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data?.error?.status && data?.error?.message) {
        return data as SpotifyErrorResponse;
      }
    }
    return null;
  } catch {
    return null;
  }
}

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

    // Special handling for 400 status code
    if (response.status === 400) {
      const spotifyError = await parseSpotifyError(response);
      if (spotifyError) {
        // Don't retry 400 errors as they indicate invalid requests
        throw new RetryFetchError(
          spotifyError.error.message,
          400,
          input.toString(),
          undefined,
          spotifyError
        );
      }
    }

    if (response.ok) {
      return response;
    }

    // For other error status codes, try to parse Spotify error format
    const spotifyError = await parseSpotifyError(response.clone());
    throw new RetryFetchError(
      spotifyError?.error.message || 'Failed fetch',
      response.status,
      input.toString(),
      undefined,
      spotifyError || undefined
    );
  } catch (error) {
    if (onError) {
      onError(error as Error, attempt);
    } else {
      console.warn(`Fetch attempt ${attempt} failed:`, error);
    }

    // Don't retry 400 errors
    if (error instanceof RetryFetchError && error.statusCode === 400) {
      throw error;
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
        requestInfo: error.requestInfo,
        spotifyError: error.spotifyError
      }
      : { message: error.message };

    global.sa_event('error_api_max_retries', errorDetails);
  }

  if (showDefaultAlert) {
    // Use Spotify's error message if available
    const message = error instanceof RetryFetchError && error.spotifyError
      ? `Error: ${error.spotifyError.error.message}`
      : 'There was an error accessing the Spotify API. Please try again later. ' +
      'If the problem persists, please report this issue.';

    alert(message);
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

      // Don't retry 400 errors
      if (error instanceof RetryFetchError && error.statusCode === 400) {
        return handleFinalError(error, input, showDefaultAlert);
      }

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