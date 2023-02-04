import axios from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id as string;
    const response = await axios({
        method: 'GET',
        url: `https://www.music-flo.com/api/meta/v1/track/${id}/lyric`,
        headers: {
            'x-gm-app-name': 'FLO_WEB',
            'x-gm-device-id': process.env.FLO_DEVICE_ID,
            'x-gm-os-type': 'WEB',
            'x-gm-app-version': '7.0.0',
            'x-gm-device-mode': 'Chrome',
            'x-gm-os-version': '10',
        },
    });

    if (response.status < 200 || response.status >= 300) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    const data = response.data.data;
    if (!data) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    res.status(200).json({ok: true, data: data.lyrics});
}
