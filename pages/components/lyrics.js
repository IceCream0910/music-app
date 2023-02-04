import {useEffect, useRef, useState} from 'react';

export default function Lyrics({lyrics, time, background}) {
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
                                 className={(time >= lyric.seconds && time < lyricsArray2[index + 1].seconds) ? 'active' : 'inactive'}>
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
                    background-color: var(--nextui-colors-backgroundAlpha);
                    z-index: 9;
                    backdrop-filter: blur(50px);
                  }

                  .lyrics-body {
                    margin-top: 60px;
                    padding: 0 20px;
                    overflow-y: scroll;
                    height: calc(100vh - 250px);
                    line-height: 1.8;
                    font-size: 20px;
                  }

                  .lyrics-body > div {
                    width: fit-content;
                    -webkit-transition: .2s;
                    -moz-transition: .2s;
                    -o-transition: .2s;
                    transition: .2s;
                  }

                  .inactive {
                    opacity: 0.7;
                    font-weight: 400;
                  }

                  .active {
                    opacity: 1;
                    font-weight: 600;
                  }
                `}
            </style>
        </div>

    );
}