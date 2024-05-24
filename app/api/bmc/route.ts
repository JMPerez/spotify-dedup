import * as cheerio from 'cheerio';

import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

export async function GET(_req: NextRequest) {
  const url = 'https://www.buymeacoffee.com/jmp';
  const selector = '.text-grey71.!font-cr-regular.text-sm';
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const supportersText = $(selector).text().trim();
  const supportersNumber = supportersText.replace(/[^0-9]/g, '');

  return NextResponse.json(
    { total: supportersNumber },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400',
      },
    }
  );
}