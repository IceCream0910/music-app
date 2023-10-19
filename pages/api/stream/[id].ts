import axios from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id as string;
    let mp3Response;
    let fileName = "";
    let genieId;

    const response = await axios({
        method: 'GET',
        url: `https://app.genie.co.kr/search/category/songs.json?query=${id}&hl=false&pagesize=1&order=false&of=POPULAR&page=1`,
    });

    if (response.status < 200 || response.status >= 300) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    const data = response.data;
    genieId = data.searchResult.result.songs.items[0].song_id;

    if (!genieId) {
        res.status(500).json({ok: false, message: '데이터를 가져올 수 없어요'});
        return;
    }

    while (fileName.length < 2) {
        const mp3Url = `http://lt2.kr/m/module/fetch_song.php?song=${genieId}`;

        try {
            mp3Response = await axios.get(mp3Url, {responseType: 'arraybuffer'});
            // @ts-ignore
            fileName = mp3Response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '').replace('.mp3', '');
        } catch (error) {
            res.status(500).json({ok: false, message: 'mp3 파일을 가져올 수 없어요'});
            return;
        }
    }


    if (!mp3Response?.data) {
        res.status(500).json({ok: false, message: 'mp3 파일을 가져올 수 없어요'});
        return;
    }

    res.setHeader('Content-Type', 'audio/mpeg3;audio/x-mpeg-3;video/mpeg;video/x-mpeg;text/xml');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Set the Content-Disposition header with the desired file name
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.mp3"`);

    // Send the MP3 file to the client
    res.status(200).send(mp3Response.data);
}

export const config = {
    api: {
        responseLimit: false,
    },
}
