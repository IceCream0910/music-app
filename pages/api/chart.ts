// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await axios({
        method: 'GET',
        url: 'https://www.music-flo.com/api/display/v1/browser/chart/1/track/list?size=100',
        validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    const data = response.data;

    if (!data.data.trackList) {
        res.status(404).json({ok: false, message: '검색 결과가 없어요'});
        return;
    }

    const list = data.data.trackList;
    const result = [];

    for (const item of list) {
        result.push({
            id: item.id,
            title: item.name,
            artist: item.representationArtist.name,
            album: item.album.title,
            image: item.album.imgList[2].url,
            artistId: item.representationArtist.id,
            albumId: item.album.id,
        });
    }

    res.status(200).json({ok: true, data: result});
}