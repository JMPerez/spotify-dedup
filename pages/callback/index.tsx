import OAuthSendBack from '../../dedup/oauth-send-back';

export default function Callback() {
  OAuthSendBack();
  return null;
}
