import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Meta from '../components/meta';
import {Button, Spacer, Text} from '@nextui-org/react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, loadingState, playerState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';

export default function AlbumDetail() {
    const router = useRouter();
    const id = router.query.id;
    const [trackData, setTrackData] = useState([]);
    const [albumData, setAlbumData] = useState([]);

    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);
    const [loading, setLoading] = useRecoilState(loadingState);

    useEffect(() => {
        setLoading(true);
        if (id) {
            loadData();
            loadTrack();
        }
    }, [id]);


    const loadData = async () => {
        const res = await fetch(`/api/albumMeta?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setAlbumData(data.data[0]);
        }
        setLoading(false);
    };

    const loadTrack = async () => {
        const res = await fetch(`/api/albumTrack?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setTrackData(data.data);
        }
    };

    const handleItemClick = (id) => {
        setPlayer([...player, id]);
        setCurrentSongId(id);
    };

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
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0))'
                    }}>
                        <Text h4>{albumData.title}</Text>
                        <Text h5 style={{opacity: 0.8}}>{albumData.representationArtist}</Text>
                        <Text h6 style={{opacity: 0.5}}>{albumData.albumTypeStr} | {albumData.genreStyle}</Text>
                    </div>
                </div>
            }

            <div className="app">
                <Meta title={albumData.title}/>
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
                                <div className="left">
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
                                <div className="right">
                                    <div className="clickable" onClick={() => handleItemClick(item.id)}><IonIcon
                                        name="play"/></div>
                                </div>
                            </div>
                        ))}
                    </div>
                }


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