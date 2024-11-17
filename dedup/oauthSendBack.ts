import AuthenticationManager from "@/src/auth/AuthenticationManager";

const OAuthSendBack = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      AuthenticationManager.handleAuthCallback(code);
      window.close();
    }
  }
};

export default OAuthSendBack;
