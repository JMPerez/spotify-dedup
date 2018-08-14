import fetchRetry from 'fetch-retry';

// todo: On 429 we should decrease the amount of requests per second in the throttle function
// since delaying won't help much
const log = response => {
  if (response.status >= 400 && global.Raven) {
    console.log(`Status ${response.status} when requesting ${response.url}`);
    Raven.captureMessage(
      `Status ${response.status} when requesting ${response.url}`
    );
  }
  return response;
};

export default (url, options) =>
  fetchRetry(url, options)
    .then(response => {
      return log(response);
    })
    .catch(response => {
      return log(response);
    });
