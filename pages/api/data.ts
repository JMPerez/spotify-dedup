import { NextApiRequest, NextApiResponse } from 'next';

import data from '../../lib/data';

export default async function SpotifyAppData(req: NextApiRequest, res: NextApiResponse) {
  let d = await data();
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );

  res.status(200).json(d);
}