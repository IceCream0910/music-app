// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id;
    const sortType = req.query.sort;
    const response = await axios({
        method: 'GET',
        url: 'https://www.music-flo.com/api/meta/v1/artist/' + id + `/track?page=1&size=100&sortType=${sortType || 'POPULARITY'}&roleType=ALL`,
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
            title: item.name,
            playTime: item.playTime,
            artist: item.representationArtist.name,
            artistId: item.representationArtist.id,
            album: item.album.title,
            albumId: item.album.id,
            image: item.album.imgList[2].url,
            trackNo: item.trackNo,
            titleYn: item.titleYn,
        });
    }

    res.status(200).json({ok: true, data: result});
}
