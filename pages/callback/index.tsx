import OAuthSendBack from '../../dedup/oauthSendBack';

export default function Callback() {
  OAuthSendBack();
  return null;
}
