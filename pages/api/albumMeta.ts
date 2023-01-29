// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  const response = await axios({
    method: 'GET',
    url: 'https://www.music-flo.com/api/meta/v1/album/'+id,
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300) {
    res.status(500).json({ ok: false, message: '데이터를 가져올 수 없어요' });
    return;
  }

  const data = response.data;

  if (!data.data) {
    res.status(404).json({ ok: false, message: '존재하지 않는 앨범이에요' });
    return;
  }

  const item = data.data;
  const result = [];
    result.push({
      id: item.id,
      agencyNm: item.agencyNm,
      albumDesc: item.albumDesc,
      title: item.title,
      releaseYmd: item.releaseYmd,
      representationArtist: item.representationArtist.name,
      albumTypeStr: item.albumTypeStr,
      genreStyle: item.genreStyle,
      image: item.imgList[4].url
    });

  res.status(200).json({ ok: true, data: result });
}
