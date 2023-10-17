import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, isPlaylistOpenedState, loadingState, playerState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {Button, Spacer} from '@nextui-org/react';
import {BottomSheet} from 'react-spring-bottom-sheet'
import {Toaster} from 'react-hot-toast';
import Lyrics from "./lyrics";

export default function Player() {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [isPlaying, setIsPlaying] = useState(false);
    let id = currentSongId;
    const [data, setData] = useState(null);
    const audioRef = useRef(null);
    const [lyrics, setLyrics] = useState(null);
    const [isLyricsMode, setIsLyricsMode] = useState(false);
    const [isPlaylistOpened, setIsPlaylistOpened] = useRecoilState(isPlaylistOpenedState);
    const albumartRef = useRef(null);
    const controllerRef = useRef(null);

    let audio;
    useEffect(() => {
        id = currentSongId;
        if (id) {
            loadData();
        }
    }, [id]);


    useEffect(() => {
        if (!data) return;
        if (id) {
            if (!data.title) return;
            fetch(`/api/stream/${data.title.replace('&', ' ').replace('?', '') + ' ' + data.artist.replace('&', ' ').replace('?', '')}`)
                .then((res) => {
                    return res.json(); //Promise 반환
                })
                .then((json) => {
                    console.log(json); // 서버에서 주는 json데이터가 출력 됨
                    audioRef.current.src = json.mp3Url;
                    handlePlay();
                });
        } else if (!isPlaying) { //이전 재생 곡 로딩
            fetch(`/api/stream/${data.title.replace('&', ' ').replace('?', '') + ' ' + data.artist.replace('&', ' ').replace('?', '')}`)
                .then((res) => {
                    return res.json(); //Promise 반환
                })
                .then((json) => {
                    console.log(json); // 서버에서 주는 json데이터가 출력 됨
                    audioRef.current = new Audio(json.mp3Url);
                    handlePause();
                });
        }
    }, [data]);


    const handlePlay = () => {
        const audio = audioRef.current;
        console.log(audio.src);
        audio.play().catch((e) => {
            console.log(e);

            // If play fails, retry every 5 seconds
            const retryInterval = setInterval(() => {
                loadAndPlayAudio(audio.src);
            }, 6000);

            // Stop retrying when audio plays successfully
            audio.addEventListener('play', () => {
                clearInterval(retryInterval);
                setIsPlaying(true);
            });
        });
    };

    const loadAndPlayAudio = (url) => {
        if (!data.title) return;
        fetch(`/api/stream/${data.title.replace('&', ' ').replace('?', '') + ' ' + data.artist.replace('&', ' ').replace('?', '')}`)
            .then((res) => {
                return res.json(); //Promise 반환
            })
            .then((json) => {
                console.log(json); // 서버에서 주는 json데이터가 출력 됨
                audioRef.current.src = json.mp3Url;
                handlePlay();
            });
    };

    const handlePause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleToggle = () => {
        if (audioRef.current.paused) {
            handlePlay();
        } else {
            handlePause();
        }
    };

    // audio progress bar
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const handleTimeUpdate = () => {
        if (isSeeking) return;
        const audio = audioRef.current;
        setDuration(audio.duration);
        setProgress(audio.currentTime);
    };

    const handleSeeking = (e) => {
        setIsSeeking(true);
        const audio = audioRef.current;
        const {value} = e.target;
        setProgress(value);
    }

    const handleSeekComplete = (e) => {
        if (!isSeeking) return;
        const audio = audioRef.current;
        const {value} = e.target;
        audio.currentTime = value;
        setIsSeeking(false);
    }

    const loadData = async () => {
        setLoading(true);
        const res = await fetch(`/api/music?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setData(data.data);
        } else {
            alert(data.message || '오류가 발생했어요');
        }
        setLoading(false);
        const lyricsRes = await fetch(`/api/lyric?id=${id}`);
        const lyricsData = await lyricsRes.json();
        if (lyricsData.ok) {
            setLyrics(lyricsData.data);
        } else {
            alert(data.message || '오류가 발생했어요');
        }
    };

    const handlePrev = () => {
        const index = player.findIndex((item) => item === currentSongId);
        console.log(player, index)
        if (index === 0) {
            //toast.error('처음 곡입니다.');
            return;
        } else {
            setCurrentSongId(player[index - 1]);
        }
    };

    const handleNext = () => {
        const index = player.findIndex((item) => item === currentSongId);
        console.log(player, index)
        if (index === player.length - 1) {
            //toast.error('마지막 곡입니다.');
            return;
        } else {
            setCurrentSongId(player[index + 1]);
        }
    };

    const handleEnded = () => {
        handleNext();
    }


    //bottom sheet
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <audio style={{display: 'none'}} onTimeUpdate={() => handleTimeUpdate()} ref={audioRef}
                   onEnded={() => handleEnded()}
                   controls></audio>
            <BottomSheet open={isOpen} expandOnContentDrag={true} onDismiss={() => setIsOpen(false)}
                         scrollLocking={true}>
                {isLyricsMode &&
                    <Button light auto onClick={() => setIsLyricsMode(false)} style={{fontSize: '20px'}}><IonIcon
                        name="close-outline"/></Button>
                }
                {!isLyricsMode &&
                    <Button light auto onClick={() => setIsOpen(false)} style={{fontSize: '20px'}}><IonIcon
                        name="chevron-down-outline"/></Button>}

                {data ? (
                    <>
                        <img className="playerAlbumart" ref={albumartRef} src={data.image}
                             onClick={() => setIsLyricsMode(true)}/>
                        {(lyrics && isLyricsMode) &&
                            <Lyrics lyrics={lyrics} time={progress} background={data.image}/>}
                        <div className="blurredAlbumart"/>

                        <div className={'player-content-wrap'}>
                            <div className={'player-info'}>
                                <div style={{
                                    opacity: 0.99,
                                    zIndex: 1,
                                    fontSize: '25px',
                                    fontWeight: 'bold'
                                }}>{data.title}</div>
                                <div style={{opacity: 0.8, zIndex: 1}}>{data.artist}</div>
                            </div>
                            <Spacer y={1}/>
                            <div className='controller' ref={controllerRef}>
                                <input type="range" max={duration} value={progress} className="progressbar"
                                       onChange={(e) => handleSeeking(e)} onMouseOut={(e) => handleSeekComplete(e)}
                                       onTouchEnd={(e) => handleSeekComplete(e)}/>
                                <div className='controller-flex'>
                                    <div className="clickable" onClick={() => handlePrev()}><IonIcon name="play-back"/>
                                    </div>
                                    <div className="clickable" onClick={() => handleToggle()}
                                         style={{fontSize: '55px'}}>
                                        {isPlaying ? <IonIcon name="pause"/> : <IonIcon name="play"/>}
                                    </div>
                                    <div className="clickable" onClick={() => handleNext()}><IonIcon
                                        name="play-forward"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>재생중인 곡이 없어요</>
                )}
                <style jsx>{`
                  .player-content-wrap {
                    margin-top: -10px;
                    padding: 20px;
                    height: calc(100vh - ${albumartRef.current ? albumartRef.current.clientHeight : 0}px) !important;
                    background-color: transparent;
                  }

                  .player-info {
                    position: absolute;
                    bottom: ${controllerRef.current && controllerRef.current.clientHeight + 50}px;
                  }

                  .blurredAlbumart {
                    background-image: url(${data && data.image});
                    background-size: contain;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100dvw;
                    height: calc(100vh - ${albumartRef.current && albumartRef.current.clientHeight + 'px' || '50vh'} + 30px);
                    -webkit-user-drag: none;
                    scale: 1.5;
                    filter: blur(30px);
                    z-index: 0;
                    transition: transform 1s ease;
                  }

                  .controller {
                    position: absolute;
                    bottom: 50px;
                    font-size: 30px;
                    z-index: 10;
                    width: calc(100% - 40px);
                  }

                  .controller-flex {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    align-items: center;
                  }

                  .playerAlbumart {
                    width: 100%;
                    margin-top: -40px;
                    -webkit-user-drag: none;
                    cursor: pointer;
                  }

                `}</style>
            </BottomSheet>
            <div className="player-mini">
                {data ? (
                    <div className="item"
                         key={data.id}>
                        <div className="imageContainer" onClick={() => setIsOpen(true)}>
                            <img className="foregroundImg" src={data.image}/>
                            <img className="backgroundImg" src={data.image}/>
                        </div>
                        <div className="left"
                             onClick={() => setIsOpen(true)}>
                            <div style={{fontWeight: 'bold', fontSize: '18px'}}>{data.title}</div>
                            <div style={{fontWeight: 'light', fontSize: '14px', opacity: 0.6}}>{data.artist}</div>
                        </div>
                        <div className="right">
                            <div className="clickable" onClick={() => handleToggle()}>
                                {isPlaying ? <IonIcon name="pause"/> : <IonIcon name="play"/>}
                            </div>
                            <div onClick={() => setIsPlaylistOpened(true)}><IonIcon name="list"/></div>
                        </div>
                    </div>
                ) : (
                    <>재생중인 곡이 없어요</>
                )}
                <style jsx>{`
                  .player-mini {
                    position: fixed;
                    bottom: 65px;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                    padding: 10px 20px 10px 20px;
                    background-color: var(--nextui-colors-backgroundAlpha);
                    -webkit-backdrop-filter: blur(30px);
                    backdrop-filter: blur(30px);
                    z-index: 999;
                  }

                  .item {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    width: 100%;
                  }

                  .imageContainer {
                    position: relative;
                    width: max-content;
                  }

                  .imageContainer .foregroundImg {
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    pointer-events: none;
                  }

                  .imageContainer .backgroundImg {
                    position: absolute;
                    top: 5px;
                    left: 0;
                    filter: blur(4px);
                    z-index: 1;
                  }

                  .item img {
                    width: 50px;
                    min-width: 50px;
                    border-radius: 10px;
                    -webkit-user-drag: none;
                  }

                  .item .left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex-basis: 100%;
                    margin-left: 15px;
                    margin-right: 10px;
                    line-height: 1.2;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }

                  .item .left div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }

                  .item .right {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    font-size: 22px;
                  }
                `}</style>
            </div>
            <Toaster/>
        </div>
    )

};