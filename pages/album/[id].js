import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Meta from '../components/meta';
import {Button, Spacer, Text} from '@nextui-org/react';
import {useRecoilState} from 'recoil';
import {
    currentSongIdState,
    infoModalDataState,
    isInfoModalOpenedState,
    loadingState,
    playerState
} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {BottomSheet} from "react-spring-bottom-sheet";

export default function AlbumDetail() {
    const router = useRouter();
    const id = router.query.id;
    const [trackData, setTrackData] = useState([]);
    const [albumData, setAlbumData] = useState([]);

    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);
    const [loading, setLoading] = useRecoilState(loadingState);

    const [albumDescModalOpen, setAlbumDescModalOpen] = useState(false);

    const [infoModalData, setInfoModalData] = useRecoilState(infoModalDataState);
    const [isInfoModalOpened, setIsInfoModalOpened] = useRecoilState(isInfoModalOpenedState);

    useEffect(() => {
        setLoading(true);
        if (id) {
            loadData();
            loadTrack();
        }
    }, [id]);


    const loadData = async () => {
        const res = await fetch(`/api/album/meta?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setAlbumData(data.data[0]);
        }
        setLoading(false);
    };

    const loadTrack = async () => {
        const res = await fetch(`/api/album/track?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setTrackData(data.data);
        }
    };


    const handleItemClick = (item) => {
        if (currentSongId === item.id) {
            setCurrentSongId(item.id);
            return;
        }
        setPlayer([...player, {
            id: item.id,
            title: item.title,
            artist: item.artist,
        }]);
        setCurrentSongId(item.id);
    };

    function playAllTrack() {
        console.log(trackData);
        setPlayer([...player, trackData.map((item) => {
            return {
                id: item.id,
                title: item.title,
                artist: item.artist,
            }
        })]);
        setCurrentSongId(trackData[0].id);
    }

    function shuffleAllTrack() {
        setPlayer(trackData.map((item) => {
            return {
                id: item.id,
                title: item.title,
                artist: item.artist,
            }
        }).sort(() => Math.random() - 0.5));
        setCurrentSongId(trackData[0].id);
    }

    return (
        <>
            {albumData &&
                <div>
                    <img className="playerAlbumart" src={albumData.image}/>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        marginTop: '-100px',
                        padding: '20px',
                        lineHeight: 1,
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0))'
                    }}>
                        <Text h3>{albumData.title}</Text>
                        <Text h5 style={{opacity: 0.8}}
                              onClick={() => router.push('/artist/' + albumData.artistId)}>{albumData.representationArtist}</Text>
                        <Text h6 style={{opacity: 0.5}}>
                            {albumData.albumTypeStr} | {albumData.genreStyle} | {albumData.releaseYmd?.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                            &nbsp;
                            <span style={{float: 'right', marginTop: '-5px'}}
                                  onClick={() => setAlbumDescModalOpen(true)}>앨범 소개<IonIcon
                                name={'chevron-forward'}/></span>
                        </Text>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            marginTop: '30px',
                            gap: '15px',
                        }}>
                            <Button className={'icon-btn'} auto onClick={() => playAllTrack()}>
                                <IonIcon name={'play'}/>&nbsp;&nbsp;전곡 재생</Button>
                            <Button className={'icon-btn'} auto flat onClick={() => shuffleAllTrack()}>
                                <IonIcon name={'shuffle'}/>&nbsp;&nbsp;셔플 재생</Button>
                        </div>
                    </div>
                </div>
            }

            <div className="app">
                <Meta title={albumData.title + ' 앨범 정보'}/>
                <Button light auto onClick={() => router.back()} style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    fontSize: '20px',
                    paddingLeft: 0
                }}><IonIcon
                    name="chevron-back-outline"/></Button>
                <Spacer y={1}/>


                {trackData &&
                    <div className="result-container" style={{marginTop: '-20px'}}>
                        {trackData.map((item) => (
                            <div
                                className="item track"
                                key={item.id}>
                                <div className="left" onClick={() => handleItemClick(item)}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>{item.title} {item.titleYn === 'Y' &&
                                        <div className="title-badge">TITLE</div>} </div>
                                    <div style={{
                                        fontWeight: 'light',
                                        fontSize: '14px',
                                        opacity: 0.6
                                    }}>{item.artist}—{item.album}</div>
                                </div>
                                <div className="right"
                                     onClick={() => {
                                         setIsInfoModalOpened(true);
                                         setInfoModalData(item);
                                     }}>
                                    <div className="clickable"><IonIcon name="ellipsis-vertical"/></div>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                <BottomSheet open={albumDescModalOpen} onDismiss={() => setAlbumDescModalOpen(false)}>
                    <div style={{padding: '20px'}}>
                        <Text h4>앨범 소개</Text>
                        <Spacer y={1}/>
                        <div
                            style={{
                                lineHeight: 1.5,
                                whiteSpace: 'pre-line',
                                height: '80dvh',
                                overflow: 'scroll'
                            }}>{albumData.albumDesc}</div>
                    </div>

                    <div className={'bottom-btn'}>
                        <Button style={{width: '100%', height: '50px'}} rounded color={'white'}
                                onClick={() => setAlbumDescModalOpen(false)}>닫기</Button>
                    </div>
                </BottomSheet>


                <style jsx>{`
                  .result-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 20px;
                  }

                  .playerAlbumart {
                    width: 100%;
                    margin-top: -40px;
                    -webkit-user-drag: none;
                    cursor: pointer;
                    object-fit: contain;
                  }

                  .item {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                  }

                  .imageContainer {
                    position: relative;
                    width: 50%;
                  }

                  .imageContainer .foregroundImg {
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    pointer-events: none;
                  }

                  .imageContainer .backgroundImg {
                    position: absolute;
                    top: 15px;
                    left: 0;
                    filter: blur(40px);
                    z-index: 1;
                  }

                  .imageContainer img {
                    width: 100%;
                    border-radius: 20px;
                    -webkit-user-drag: none;
                  }

                  .title-badge {
                    background-color: var(--nextui-colors-blue600);
                    border-radius: 5px;
                    font-size: 10px;
                    height: 15px;
                    padding: 2px 5px 0 5px;
                  }

                  .item .left, .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex-basis: 100%;
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
                  }
                `}
                </style>
            </div>
        </>
    )
}