import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Meta from './components/meta';
import {Text} from '@nextui-org/react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, loadingState, playerState} from '../states/states';
import IonIcon from '@reacticons/ionicons';
import {Toaster} from 'react-hot-toast';

const Discover = () => {
    const [player, setPlayer] = useRecoilState(playerState);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    const router = useRouter();

    const [trackData, setTrackData] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    const [artistData, setArtistData] = useState([]);

    const [chart, setChart] = useState([]);
    const [selectedId, setSelectedId] = useState('');


    useEffect(() => {
        setLoading(true);
        loadRankData();
    }, []);

    const loadRankData = async () => {
        const res = await fetch(`/api/chart`);
        const data = await res.json();
        if (data.ok) {
            setChart(data.data);
        }
        setLoading(false);
    };


    const handleItemClick = (id) => {
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
    };


    return (
        <div className="app">
            <Meta title="차트"/>
            <Text h3 weight="black">차트</Text>

            <div>
                <div className="result-container">
                    {chart.map((item, index) => (
                        <div
                            className="item track"
                            key={item.id}
                            onMouseOver={() => setSelectedId(item.id)}
                            onTouchStart={() => setSelectedId(item.id)}
                        >
                            <Text h3 weight="black" className='rankText'>{index + 1}</Text>
                            <div className="imageContainer"
                                 onClick={() => handleItemClick(item.id)}>
                                <img className="foregroundImg" src={item.image} loading="lazy"/>
                                <img className="backgroundImg" src={item.image} loading="lazy"/>
                            </div>
                            <div className="left" onClick={() => handleItemClick(item.id)}>
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

            <style jsx>{`
              .result-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 20px;
              }

              .album img {
                width: 50%;
                border-radius: 20px;
                -webkit-user-drag: none;
              }

              .artist img {
                width: 50%;
                border-radius: 50%;
                -webkit-user-drag: none;
              }

              .item .left, .info {
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

              .item {
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
              }

              .rankText {
                margin-right: 20px;
                opacity: 0.6;
              }

              .imageContainer {
                position: relative;
                left: 10px;
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
                margin-left: 30px;
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

export default Discover;
