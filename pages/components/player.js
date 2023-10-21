import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, loadingState, playerState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {Button, Loading, Spacer} from '@nextui-org/react';
import {BottomSheet} from 'react-spring-bottom-sheet'
import toast, {Toaster} from 'react-hot-toast';
import Lyrics from "./lyrics";
import Playlist from "./playlist";

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
    const albumartRef = useRef(null);
    const controllerRef = useRef(null);
    const [isBuffering, setIsBuffering] = useState(false);

    let audio;

    const browserPreventEvent = () => {
        history.pushState(null, "", location.href);
        router.push(router.asPath);
        setIsOpen(false);
    };

    useEffect(() => {
        history.pushState(null, "", location.href);
        window.addEventListener("popstate", () => {
            browserPreventEvent();
        });
        return () => {
            window.removeEventListener("popstate", () => {
                browserPreventEvent();
            });
        };
    }, []);

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
            document.cookie = "HttpOnly; Secure; SameSite=None";
            audioRef.current.src = `https://melong-stream.sungil.me/api/stream?id=${data.title.replace('&', ' ').replace('?', '') + ' ' + data.artist.replace('&', ' ').replace('?', '')}`;
            handlePlay();
        } else if (!isPlaying) { //이전 재생 곡 로딩
            document.cookie = "HttpOnly; Secure; SameSite=None";
            audioRef.current.src = `https://melong-stream.sungil.me/api/stream?id=${data.title.replace('&', ' ').replace('?', '') + ' ' + data.artist.replace('&', ' ').replace('?', '')}`;
            handlePause();
        }
    }, [data]);

    useEffect(() => {
        console.log(player)
    }, [player]);


    const handlePlay = () => {
        const audio = audioRef.current;
        console.log(audio.src);
        setIsBuffering(true)
        audio.play().catch((e) => {
            console.log(e);

            audio.addEventListener('play', () => {
                setIsPlaying(true);
            });

            audio.addEventListener('playing', () => {
                setIsBuffering(false);
            });

            audio.addEventListener('waiting', () => {
                setIsBuffering(true);
            });
        });
        setIsPlaying(true);
        setIsBuffering(false);
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
        const dataTemp = await res.json();
        if (dataTemp.ok) {
            //metadata 설정
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: dataTemp.data.title || '제목없음',
                    artist: dataTemp.data.artist || '아티스트 없음',
                    album: dataTemp.data.album || '앨범 없음',
                    artwork: [
                        {src: dataTemp.data.image || '/', sizes: '1000x1000', type: 'image/png'},
                    ]
                });
            }
            setData(dataTemp.data);
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
        const index = player.findIndex((item) => item.id === currentSongId);
        console.log(player, index)
        if (index === 0) {
            toast('처음 곡입니다.');
            return;
        } else {
            setCurrentSongId(player[index - 1].id);
        }
    };

    const handleNext = () => {
        const index = player.findIndex((item) => item.id === currentSongId);
        console.log(player, index)
        if (index === player.length - 1) {
            toast('마지막 곡입니다.');
            return;
        } else {
            setCurrentSongId(player[index + 1].id);
        }
    };

    const handleEnded = () => {
        handleNext();
    }


    //bottom sheet
    const [isOpen, setIsOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('PLAYER');

    return (
        <div>
            <audio style={{display: 'none'}} onTimeUpdate={() => handleTimeUpdate()} ref={audioRef}
                   onEnded={() => handleEnded()} preload={'auto'} crossOrigin={'anonymous'}
                   controls></audio>
            <BottomSheet open={isOpen} expandOnContentDrag={false} onDismiss={() => setIsOpen(false)}
                         scrollLocking={true}>
                <Button light auto onClick={() => setIsOpen(false)} style={{fontSize: '20px'}}><IonIcon
                    name="chevron-down-outline"/></Button>
                {data ? (
                    <>
                        <img className="playerAlbumart" ref={albumartRef} src={data.image}/>
                        {(currentTab === 'LYRICS') &&
                            <Lyrics lyrics={lyrics} time={progress} background={data.image}
                                    controllerRef={controllerRef}/>}
                        {(currentTab === 'PLAYLIST') &&
                            <Playlist/>}
                        <div className="blurredAlbumart"/>

                        <div className={'player-content-wrap'}>
                            <div className={'player-info'}>
                                <div style={{
                                    opacity: 0.99,
                                    zIndex: 1,
                                    fontSize: '25px',
                                    fontWeight: 'bold'
                                }}>{data.title}</div>
                                <div style={{opacity: 0.8, zIndex: 1}}
                                     onClick={() => [router.push(`/artist/${data.artistId}`), setIsOpen(false)]}>{data.artist}</div>
                            </div>
                            <Spacer y={1}/>
                            <div className='controller' ref={controllerRef}>
                                <input type="range" max={duration} value={progress} className="progressbar"
                                       onChange={(e) => handleSeeking(e)} onMouseOut={(e) => handleSeekComplete(e)}
                                       onTouchEnd={(e) => handleSeekComplete(e)}/>

                                <Spacer y={0.5}/>
                                <div className='controller-flex'>
                                    <div className="clickable" onClick={() => handlePrev()}><IonIcon name="play-back"/>
                                    </div>
                                    <div className="clickable" onClick={() => handleToggle()}
                                         style={{fontSize: '55px'}}>
                                        {isBuffering ? <Loading color={'white'} size={'lg'}></Loading> : (isPlaying ?
                                            <IonIcon name="pause"/> :
                                            <IonIcon name="play"/>)}
                                    </div>
                                    <div className="clickable" onClick={() => handleNext()}><IonIcon
                                        name="play-forward"/>
                                    </div>
                                </div>
                                <Spacer y={1}/>
                                <div className='controller-flex'
                                     style={{fontSize: '25px'}}>
                                    <div className="clickable" onClick={() => setCurrentTab('PLAYER')}><IonIcon
                                        name={currentTab === 'PLAYER' ? "musical-notes" : "musical-notes-outline"}/>
                                        {currentTab === 'PLAYER' && <div className='dot'/>}
                                    </div>

                                    <div className="clickable" onClick={() => setCurrentTab('LYRICS')}><IonIcon
                                        name={currentTab === 'LYRICS' ? "chatbox-ellipses" : "chatbox-ellipses-outline"}/>
                                        {currentTab === 'LYRICS' && <div className='dot'/>}
                                    </div>

                                    <div className="clickable" onClick={() => setCurrentTab('PLAYLIST')}><IonIcon
                                        name={currentTab === 'PLAYLIST' ? "list" : "list-outline"}/>
                                        {currentTab === 'PLAYLIST' && <div className='dot'/>}
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
                    height: calc(100vh - ${albumartRef.current && albumartRef.current.clientHeight + 'px' || '50vh'} + 20px);
                    -webkit-user-drag: none;
                    scale: 1.5;
                    filter: blur(30px);
                    z-index: 0;
                    transition: transform 1s ease;
                    transform: rotate(180deg);
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
                    justify-content: space-around;
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