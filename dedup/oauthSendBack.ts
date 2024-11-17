import { SPOTIFY_AUTH_CODE_KEY, SPOTIFY_AUTH_SUCCESS_KEY } from "@/src/auth/oauth2window";

const OAuthSendBack = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Store the code in localStorage
      localStorage.setItem(SPOTIFY_AUTH_CODE_KEY, code);
      // Store the success flag
      localStorage.setItem(SPOTIFY_AUTH_SUCCESS_KEY, 'true');
      // Close the window
      window.close();
    }
  }
};

export default OAuthSendBack;
