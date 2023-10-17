import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const response = await axios({
    method: 'GET',
    url: `https://app.genie.co.kr/search/category/songs.json?query=${id}&hl=false&pagesize=1&order=false&of=POPULAR&page=1`,
  });

  if (response.status < 200 || response.status >= 300) {
    res.status(500).json({ ok: false, message: '데이터를 가져올 수 없어요' });
    return;
  }

  const data = response.data;
  const genieId = data.searchResult.result.songs.items[0].song_id;

  if(!genieId) {
    res.status(500).json({ ok: false, message: '데이터를 가져올 수 없어요' });
    return;
  }

  res
    .status(200)
    .setHeader('Access-Control-Allow-Origin', '*')
    .send({ ok: true, mp3Url: `http://lt2.kr/m/module/fetch_song.php?song=${genieId}` });
}
