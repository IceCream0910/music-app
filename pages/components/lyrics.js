import {useEffect} from 'react';

export default function Lyrics({lyrics, time, background, controllerRef}) {
    if (!lyrics) return null;
    const lyricsArray = lyrics.split('\n');
    const lyricsArray2 = lyricsArray.map((lyric) => {
        const time = lyric.slice(1, 9);
        const seconds = (parseInt(time.slice(0, 2)) * 60 + parseInt(time.slice(3, 5)) + parseInt(time.slice(6, 8)) / 100) - 0.2;
        const text = lyric.slice(11, lyric.length).replace('\r', '');
        return {seconds, text};
    });

    useEffect(() => {
        const activeLyrics = document.querySelector('.active');
        if (activeLyrics) {
            activeLyrics.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [time]);

    const moveToLyricTime = (seconds) => {
        const audio = document.querySelector('audio');
        audio.currentTime = seconds;
    }

    return (
        <div className="lyrics-container">
            <div className='lyrics-body'>
                {lyricsArray2.map((lyric, index) => {
                        return (
                            <div key={index} onClick={() => moveToLyricTime(lyric.seconds)}
                                 className={(time >= lyric.seconds && time <= lyricsArray2[index + 1].seconds) ? 'active' : 'inactive'}>
                                {lyric.text}
                            </div>
                        );
                    }
                )}
            </div>


            <style jsx>
                {`
                  .lyrics-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.2);
                    z-index: 9;
                    backdrop-filter: blur(50px);
                  }

                  .lyrics-body {
                    margin-top: 60px;
                    padding: 0 20px;
                    overflow-y: scroll;
                    height: calc(100dvh - ${controllerRef.current && controllerRef.current.clientHeight + 100 || 250}px);
                    line-height: 2.2;
                    font-size: 23px;
                    font-weight: 1000;
                  }

                  .lyrics-body > div {
                    width: fit-content;
                    -webkit-transition: .5s;
                    -moz-transition: .5s;
                    -o-transition: .5s;
                    transition: .5s;
                  }

                  .inactive {
                    opacity: 0.3;
                  }

                  .active {
                    opacity: 1;
                  }
                `}
            </style>
        </div>

    );
}