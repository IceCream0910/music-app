import {useRouter} from 'next/router';
import SearchBox from './components/searchBox';
import {useEffect, useState} from 'react';
import Meta from './components/meta';
import {Button, Grid, Spacer, Text} from '@nextui-org/react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, loadingState, playerState} from '../states/states';
import IonIcon from '@reacticons/ionicons';
import {useLongPress} from 'use-long-press';
import toast, {Toaster} from 'react-hot-toast';

const SearchPage = (props) => {
    const [player, setPlayer] = useRecoilState(playerState);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    const router = useRouter();
    let q = router.query.q;

    const [trackData, setTrackData] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    const [artistData, setArtistData] = useState([]);

    const [searchRank, setSearchRank] = useState([]);
    const [currentTab, setCurrentTab] = useState(0); // 0: track, 1: album, 2: artist

    const [isLongPressed, setIsLongPressed] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    useEffect(() => {
        setLoading(true);
        if (!q) {
            loadRankData();
        } else {
            loadData();
        }
    }, [q]);

    const loadData = () => {
        loadTrack();
        loadAlbum();
        loadArtist();
    }

    const loadTrack = async () => {
        const res = await fetch(`/api/searchTrack?q=${q}`);
        const data = await res.json();
        if (data.ok) {
            setTrackData(data.data);
        } else {
            router.replace(`/search`);
        }
        setLoading(false);
    };

    const loadAlbum = async () => {
        const res = await fetch(`/api/searchAlbum?q=${q}`);
        const data = await res.json();
        if (data.ok) {
            setAlbumData(data.data);
        }
    };

    const loadArtist = async () => {
        const res = await fetch(`/api/searchArtist?q=${q}`);
        const data = await res.json();
        if (data.ok) {
            setArtistData(data.data);
        }
    };

    const loadRankData = async () => {
        const res = await fetch(`/api/searchRank`);
        const data = await res.json();
        if (data.ok) {
            setSearchRank(data.data);
        } else {
            router.replace(`/search`);
        }
        setLoading(false);
    };

    const handleItemClick = (id) => {
        if (!isLongPressed) {
            if (player === null) {
                setPlayer([id]);
                setCurrentSongId(id);
            } else {
                if (player[player.length] === id) {
                    setCurrentSongId(id);
                    return;
                }
                setPlayer([...player, id]);
                setCurrentSongId(id);
            }
        }
        setIsLongPressed(false);
    };

    const bind = useLongPress(() => {
        setIsLongPressed(true);
        toast.success(`이 곡을 바로 다음에 재생할게요`);
        setPlayer([...player, selectedId]);
    });

    return (
        <div className="app">
            <Meta title={`검색 - ${q}`}/>
            <Text h3 weight="black">검색</Text>
            <SearchBox initial={q}/>
            <div className="result-container">
                {(!q && searchRank) && <Text h5 weight="light"><Spacer y={1}/>🔥 사람들이 많이 검색하고 있어요</Text>}
                {!q && (
                    searchRank.map((item) => (
                        <div
                            className="item"
                            onClick={() => [router.replace(`/search?q=${item.text}`)]}
                            style={{opacity: 0.7}}
                            key={item.rank}>
                            {item.text}
                        </div>
                    )))
                }


                {q &&
                    <Grid.Container gap={2} style={{gap: '10px'}}>
                        <Button auto color="primary" flat={currentTab === 0 ? false : true} rounded
                                onClick={() => setCurrentTab(0)}>곡</Button>
                        <Button auto color="primary" flat={currentTab === 1 ? false : true} rounded
                                onClick={() => setCurrentTab(1)}>앨범</Button>
                        <Button auto color="primary" flat={currentTab === 2 ? false : true} rounded
                                onClick={() => setCurrentTab(2)}>아티스트</Button>
                    </Grid.Container>
                }
                {(q && currentTab == 0) &&
                    <div>
                        <div className="result-container">
                            {trackData.map((item) => (
                                <div
                                    className="item track"
                                    key={item.id}
                                    onMouseOver={() => setSelectedId(item.id)}
                                    onTouchStart={() => setSelectedId(item.id)}
                                >
                                    <div className="imageContainer"
                                         onClick={() => handleItemClick(item.id)} {...bind(this)}>
                                        <img className="foregroundImg" src={item.image} loading="lazy"/>
                                        <img className="backgroundImg" src={item.image} loading="lazy"/>
                                    </div>
                                    <div className="left" onClick={() => handleItemClick(item.id)} {...bind(this)}>
                                        <div style={{fontWeight: 'bold', fontSize: '18px'}}>{item.title}</div>
                                        <div style={{
                                            fontWeight: 'light',
                                            fontSize: '14px',
                                            opacity: 0.6
                                        }}>{item.artist}—{item.album}</div>
                                    </div>
                                    <div className="right">
                                        <div className="clickable"><IonIcon name="ellipsis-vertical"/></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {(q && currentTab == 1) &&
                    <div className={'container-2x1'}>
                        {albumData.map((item) => (
                            <div className="album"
                                 onClick={() => router.push(`/album/${item.id}`)}
                                 key={item.id} style={{flexDirection: 'column'}}>
                                <img style={{borderRadius: '20px', marginBottom: "10px"}} src={item.image}
                                     loading="lazy"/>
                                <div className='info' style={{margin: 0}}>
                                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>{item.title}</div>
                                    <div style={{
                                        fontWeight: 'light',
                                        fontSize: '13px',
                                        opacity: 0.6
                                    }}>{item.artist}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {(q && currentTab == 2) &&
                    <div className={'container-3x1'}>
                        {artistData.map((item) => (
                            <div className="album"
                                 key={item.id} style={{flexDirection: 'column'}}>
                                <img className={'fixedSize'} style={{borderRadius: '20px', marginBottom: "10px"}}
                                     src={item.image}
                                     loading="lazy"/>
                                <div className='info' style={{margin: 0}}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        textAlign: 'center'
                                    }}>{item.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>


            <style jsx>{`
              .result-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 20px;
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

              .item {
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
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

              .item.track img {
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
              }
            `}</style>
            <Toaster/>
        </div>
    );
};

export default SearchPage;
