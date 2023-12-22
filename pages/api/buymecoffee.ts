import * as cheerio from 'cheerio';

import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

const BuyMeACoffee = async (_req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://www.buymeacoffee.com/jmp';
  const selector = '.text-sm.font-cr-regular.text-grey71.gap-1';
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const supportersText = $(selector).text().trim();
  const supportersNumber = supportersText.replace(/[^0-9]/g, '');

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=62400, stale-while-revalidate=124800'
  );
  return res.status(200).json({ total: supportersNumber });
};

export default BuyMeACoffee;
