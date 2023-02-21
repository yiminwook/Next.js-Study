import Chromium from 'chrome-aws-lambda';
import playwrite from 'playwright-core';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const localChromePath = process.env.NODE_ENV !== 'development' ? '' : process.env.LOCAL_CHROME_PATH ?? '';
  if (process.env.NODE_ENV !== 'development') {
    const protocol = process.env.PROTOCOL || ' http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    await Chromium.font(`${baseUrl}/Pretendard-Regular.ttf`); //폰트를 로딩.
  }
  const browser = await playwrite.chromium.launch({
    args: Chromium.args,
    executablePath: process.env.NODE_ENV !== 'development' ? await Chromium.executablePath : localChromePath,
    headless: process.env.NODE_ENV !== 'development' ? Chromium.headless : true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  });

  const url = req.query.url as string;

  await page.goto(url);

  const data = await page.screenshot({
    type: 'jpeg',
  });

  await browser.close();

  //365일 보관
  res.setHeader('Cache-Control', 's-maxage=31536000, public');
  res.setHeader('Content-Type', 'image/jpeg');
  res.end(data);
}
