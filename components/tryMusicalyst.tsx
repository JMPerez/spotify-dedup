import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Translation } from 'react-i18next';

const TryMusicalyst = ({ accessToken }: { accessToken: string }) => {
  const [hasUsedMusicalyst, setHasUsedMusicalyst] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://musicalyst.com/api/profile`, {
        method: 'GET',
        headers: { 'Spotify-Auth': accessToken },
      });
      const data = await response.json();
      setHasUsedMusicalyst(data.hasUsedSpotifyTop);
    };
    fetchData();
  }, []);

  return (
    !hasUsedMusicalyst && <Card>
      <CardHeader>
        <CardTitle><Translation>
          {(t) => t('spotifytop.heading')}
        </Translation></CardTitle>
        <CardDescription><Translation>
          {(t) => t('spotifytop.description')}
        </Translation>{' '}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>
            <Translation>{(t) => t('spotifytop.check1')}</Translation>
            ,{' '}
            <a
              href="https://musicalyst.com/?ref=spotifydedup"
              target="_blank"
              rel="noreferrer"
            >
              Musicalyst
            </a>
          </strong>{' '}
          <Translation>{(t) => t('spotifytop.check2')}</Translation></p>
      </CardContent>
    </Card>
  )
}

export default TryMusicalyst;