import { NextApiRequest, NextApiResponse } from 'next';

import screenshot from '../../lib/screenshot';

export default async function Screenshot(req: NextApiRequest, res: NextApiResponse) {
    const url = 'https://en.wikipedia.org/wiki/WeCrashed';
    const file = await screenshot(url);
    res.setHeader('Content-Type', `image/png`);
    res.setHeader(
        'Cache-Control',
        `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.statusCode = 200;
    res.end(file);
}