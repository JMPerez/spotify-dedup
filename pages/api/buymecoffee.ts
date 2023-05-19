import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import cheerio from 'cheerio';

const BuyMeACoffee = async (_req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://www.buymeacoffee.com/jmp';
  const selector = '.text-fs-20.cr-regular.clr-grey.xs-text-fs-16.mg-t-12.xs-mg-t-8';
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const supportersText = $(selector).text().trim();
  const supportersNumber = supportersText.replace(/[^0-9]/g, '');

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=7200, stale-while-revalidate=3600'
  );
  return res.status(200).json({ total: supportersNumber });
};

export default BuyMeACoffee;
