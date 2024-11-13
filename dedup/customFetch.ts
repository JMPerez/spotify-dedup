import { logEvent } from "@/utils/analytics";
import oauthManager from './oauthManager';

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
    public url?: string,
    public httpMethod?: string,
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
    const url = input.toString();
    const httpMethod = fetchOptions.method ?? 'GET';

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RetryFetchError(
        'Rate limited',
        429,
        url,
        httpMethod,
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
          url,
          httpMethod,
          undefined,
          spotifyError
        );
      }
    }

    if (response.status === 401) {
      const spotifyError = await parseSpotifyError(response);
      if (spotifyError?.error.message === 'The access token expired') {
        // Refresh the token with 'expired' reason
        const newToken = await oauthManager.refreshAccessToken('expired');

        // Update the Authorization header with the new token
        if (fetchOptions.headers) {
          (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        } else {
          fetchOptions.headers = {
            'Authorization': `Bearer ${newToken}`
          };
        }

        // Retry the request immediately with the new token
        return await fetch(input, fetchOptions);
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
      url,
      httpMethod,
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

  const errorDetails = error instanceof RetryFetchError
    ? {
      message: error.message,
      statusCode: error.statusCode,
      url: error.url,
      httpMethod: error.httpMethod,
      spotifyError: error.spotifyError
    }
    : { message: error.message };

  logEvent('error_api_max_retries', errorDetails);

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