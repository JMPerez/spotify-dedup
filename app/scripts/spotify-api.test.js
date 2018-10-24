import SpotifyWebApi from './spotify-api';

test('it works', async () => {
  const api = new SpotifyWebApi();
  const token = 'my token';
  api.setAccessToken(token);
  window.fetch = jest.fn().mockImplementation((url, options) => {
    expect(url).toBe('https://api.spotify.com/v1/me');
    expect(options).toEqual({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve({
      ok: true,
      json: () => {
        return {};
      },
    });
  });
  const result = await api.getMe();
  expect(result).toEqual({});
});
