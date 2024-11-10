
const OAuthSendBack = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Store the code in localStorage
      localStorage.setItem('spotify_auth_code', code);
      // Close the window
      window.close();
    }
  }
};

export default OAuthSendBack;
