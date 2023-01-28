import Hls from 'hls.js';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playerState } from '../states';
import IonIcon from '@reacticons/ionicons';
import { Button, Text, Spacer } from '@nextui-org/react';
import { BottomSheet } from 'react-spring-bottom-sheet'

const Player = () => {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [isPlaying, setIsPlaying] = useState(false);
    let id = player;

    const [data, setData] = useState(null);

    const audioRef = useRef(null);

    useEffect(() => {
        if (!id) {
            const lastPlaySongId = localStorage.getItem('lastPlaySongId');
            if (lastPlaySongId) {
                id = lastPlaySongId;
                setIsPlaying(false);
                loadData();
            } else { return; }

        }
        localStorage.setItem('lastPlaySongId', id);
        loadData();
    }, [id]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!data || !audio) return;

        const hls = new Hls();
        hls.loadSource(`/api/stream/${data.id}`);
        hls.attachMedia(audio);
        handlePlay();
    }, [data]);

    const handlePlay = () => {
        audioRef.current.play().catch((e) => {
            console.log(e);
            return;
        });
        setIsPlaying(true);
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

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
    };

    const loadData = async () => {
        const res = await fetch(`/api/music?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setData(data.data);
        } else {
            alert(data.message || '오류가 발생했어요');
        }
    };


    //bottom sheet
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <audio style={{ display: 'none' }} onTimeUpdate={() => handleTimeUpdate()} ref={audioRef} controls></audio>
            <BottomSheet open={isOpen} expandOnContentDrag={true} onDismiss={() => setIsOpen(false)} scrollLocking={true}>
                <Button light auto onClick={() => setIsOpen(false)} style={{ fontSize: '20px' }}><IonIcon name="chevron-down-outline" /></Button>
                {data ? (
                    <div style={{ padding: '20px' }}>
                        <div className="imageContainer">
                            <img className="foregroundImg" src={data.image} />
                            <img className="backgroundImg" src={data.image} />
                        </div>
                        <Spacer y={2} />
                        <div><Text h3 weight="black">{data.title}</Text></div>
                        <div style={{ opacity: 0.8, marginTop: '-10px' }}>{data.artist}</div>
                        <Spacer y={1} />
                        <input type="range" min="1" max="100" value={progress} className="progressbar" />
                        <div className='controller'>
                            <div className="clickable"><IonIcon name="play-back" /></div>
                            <div className="clickable" onClick={() => handleToggle()} style={{ fontSize: '45px' }}>
                                {isPlaying ? <IonIcon name="pause" /> : <IonIcon name="play" />}
                            </div>
                            <div className="clickable"><IonIcon name="play-forward" /></div>
                        </div>
                    </div>
                ) : (
                    <>재생중인 곡이 없어요</>
                )}
                <style jsx>{`
                    .progressbar {
                        width: 100%;
                        outline:none;
                        border-radius:20px;
                    }
                    .controller {
                        display:flex;
                        flex-direction:row;
                        width:calc(100% - 40px);
                        justify-content: space-evenly;
                        align-items: center;
                        position: absolute;
                        bottom:50px;
                        font-size:30px;
                    }
                    .imageContainer {
                        position: relative;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        -webkit-user-drag: none;
                    }
                    .imageContainer .foregroundImg {
                        cursor: pointer;
                        position: relative;
                        z-index: 2;
                        pointer-events: none;
                        -webkit-user-drag: none;
                    }
                    .imageContainer .backgroundImg {
                        position: absolute;
                        top: 5px;
                        filter: blur(90px);
                        z-index: 1;
                        -webkit-user-drag: none;
                    }
                    img {
                        width: 100%;
                        border-radius:20px;
                        -webkit-user-drag: none;
                    }
                    `}</style>
            </BottomSheet>
            <div className="player-mini">
                {data ? (
                    <div className="item"
                        key={data.id}>
                        <div className="imageContainer">
                            <img className="foregroundImg" src={data.image} />
                            <img className="backgroundImg" src={data.image} />
                        </div>
                        <div className="left"
                            onClick={() => setIsOpen(true)}>
                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{data.title}</div>
                            <div style={{ fontWeight: 'light', fontSize: '14px', opacity: 0.6 }}>{data.artist}</div>
                        </div>
                        <div className="right">
                            <div className="clickable" onClick={() => handleToggle()}>
                                {isPlaying ? <IonIcon name="pause" /> : <IonIcon name="play" />}
                            </div>
                            <div><IonIcon name="list" /></div>
                        </div>
                    </div>
                ) : (
                    <>재생중인 곡이 없어요</>
                )}
                <style jsx>{`
                    .player-mini {
                        position: fixed;
                        bottom: 65px;
                        width:100%;
                        display:flex;
                        flex-direction:row;
                        gap:20px;
                        padding:10px 20px 10px 20px;
                        background-color: var(--nextui-colors-backgroundAlpha);
                        -webkit-backdrop-filter: blur(30px);
                        backdrop-filter: blur(30px);
                        z-index:999;
                    }

                    .item {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: nowrap;
                        width:100%;
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
                        width:50px;
                        min-width:50px;
                        border-radius:10px;
                        -webkit-user-drag: none;
                    }
                    .item .left {
                        display:flex;
                        flex-direction: column;
                        justify-content: center;
                        flex-basis: 100%;
                        margin-left:15px;
                        margin-right:10px;
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
                        display:flex;
                        justify-content: center;
                        align-items : center;
                        gap:10px;
                        font-size:22px;
                    }
                    `}</style>
            </div>
        </div>
    )

};

export default Player;