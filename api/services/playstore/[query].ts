import { VercelRequest, VercelResponse } from '@vercel/node';
import 'cross-fetch';
import { fetch, send, sendError } from '../../../util/http';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return sendError(res, new Error('No query given'));
  }

  try {
    const responseText = await fetch(
      `https://play.google.com/store/search?c=apps&q=${encodeURIComponent(
        query
      )}`,
      'GET'
    ).then((res) => res.text());

    const response = JSON.parse(
      responseText.match(
        /AF_initDataCallback.+?hash: '6'.+?data:([\w\W]+?), sideChannel/m
      )?.[1] ?? ''
    );

    const apps = response[0][1][0][0][0].map((entry: any) => ({
      id: entry[12][0],
      name: entry[2],
      author: entry[4][0][0][0],
      rating: entry[6][0][2][1][1],
      url: 'https://play.google.com' + entry[9][4][2],
    }));
    send(res, { result: apps.slice(0, 10) });
  } catch (err: any) {
    sendError(res, err);
  }
}
