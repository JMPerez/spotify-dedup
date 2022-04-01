import { NextApiRequest, NextApiResponse } from 'next';

//import SpotifyAppStats from '../../lib/SpotifyAppStats';

export default async function Screenshot(req: NextApiRequest, res: NextApiResponse) {
    let data = null;
    /*if (
        process.env.SPOTIFY_USERNAME &&
        process.env.SPOTIFY_PASSWORD &&
        process.env.SPOTIFY_APP_ID
    ) {
        const spotifyAppStats = new SpotifyAppStats();
        await spotifyAppStats.init();
        await spotifyAppStats.login(
            process.env.SPOTIFY_USERNAME,
            process.env.SPOTIFY_PASSWORD
        );
        data = await spotifyAppStats.getStats(process.env.SPOTIFY_APP_ID);
        spotifyAppStats.destroy();
    }*/

    res.status(200).json(data);
}