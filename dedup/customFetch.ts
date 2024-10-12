/**
 * Custom Fetch is a fetcher that retries requests with exponential delay
 *
 * This custom fetch has the same interface as native fetch
 * with three extra options for init param:
 *  times    - number of attemps    (defaults 3)
 *  delay    - basic delay in ms    (defaults 1000)
 *  backoff  - exponential backoff  (defaults 1.3)
 */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryFetch(
  input: RequestInfo,
  init?: RequestInit & { times?: number; delay?: number; backoff?: number }
) {
  const times = init?.times || 3;
  const delay = init?.delay || 1000;
  const backoff = init?.backoff || 1.3;

  for (let attemp = 1; attemp <= times; attemp++) {
    try {
      const response = await fetch(input, init);

      if (response.status < 400) {
        return response;
      }

      throw new Error('Failed fetch');
    } catch (error) {
      console.warn('Fetch attemp failed', attemp);

      if (attemp < times) {
        await sleep(delay * attemp * backoff);
        continue;
      }

      if (attemp === times) {
        console.warn('Max attemps reached');

        alert('There was an error accessing Spotify\'s Web API. Please try again later. If the problem persist, please file an issue on https://github.com/JMPerez/spotify-dedup/issues/')
        throw error;
      }
    }
  }
}

export default retryFetch;
