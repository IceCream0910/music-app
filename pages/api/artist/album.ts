// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id;
    const response = await axios({
        method: 'GET',
        url: 'https://www.music-flo.com/api/meta/v1/artist/' + id + `/album?page=1&size=100&sortType=RECENT&roleType=RELEASE`,
        validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    const data = response.data;

    if (!data.data.list) {
        res.status(404).json({ok: false, message: '검색 결과가 없어요'});
        return;
    }

    const list = data.data.list;
    const result = [];

    for (const item of list) {
        result.push({
            id: item.id,
            title: item.title,
            releasedYmd: item.releasedYmd,
            artist: item.representationArtist.name,
            albumTypeStr: item.albumTypeStr,
            image: item.imgList[4].url,
        });
    }

    res.status(200).json({ok: true, data: result});
}
