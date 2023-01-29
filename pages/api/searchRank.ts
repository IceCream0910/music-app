// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.q;
  const response = await axios({
    method: 'GET',
    url: 'https://www.music-flo.com/api/search/v2/search/keyword',
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300) {
    res.status(500).json({ ok: false, message: '데이터를 가져올 수 없어요' });
    return;
  }

  const data = response.data;

  if (!data.data.list) {
    res.status(404).json({ ok: false, message: '검색 결과가 없어요' });
    return;
  }

  const list = data.data.list[0].list;
  const result = [];

  for (const item of list) {
    result.push({
      text: item.text,
      rank: item.rank,
      createDtime: item.createDtime,
    });
  }

  res.status(200).json({ ok: true, data: result });
}
