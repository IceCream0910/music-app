import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Meta from '../components/meta';
import { Text, Link, Grid, Button, Spacer } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { playerState } from '../../states/states';
import IonIcon from '@reacticons/ionicons';

export default function AlbumDetail() {
    const router = useRouter();
    const id = router.query.id;
    const [trackData, setTrackData] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    
    const [player, setPlayer] = useRecoilState(playerState);

    useEffect(() => {
        if (id){
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
    };

    const loadTrack = async () => {
        const res = await fetch(`/api/albumTrack?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setTrackData(data.data);
        }
    };

    const handleItemClick = (id) => {
      setPlayer(id);
    };

    return (
        <div className="app">
            <Meta title={albumData.title} />
            <Button light auto onClick={() => router.back()} style={{ fontSize: '20px', paddingLeft: 0 }}><IonIcon name="chevron-back-outline" /></Button>
            <Spacer y={1} />
            {albumData &&
            <div>
              <div className="imageContainer">
              <img className="foregroundImg" src={albumData.image} />
              <img className="backgroundImg" src={albumData.image} />
            </div>
            <Spacer y={1} />
            <div style={{lineHeight: 1}}>
              <Text h4>{albumData.title}</Text>
              <Text h5 style={{opacity: 0.8}}>{albumData.representationArtist}</Text>
              <Text h6 style={{opacity: 0.5}}>{albumData.albumTypeStr} | {albumData.genreStyle}</Text>
            </div>
            <Spacer y={1} />
            <hr/>
            <Spacer y={1} />
            </div>
            }


            {trackData && 
            <div className="result-container">
            {trackData.map((item) => (
              <div
                className="item track"
          key={item.id}>
          <div className="left">
            <div style={{ fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>{item.title} {item.titleYn === 'Y' && <div className="title-badge">TITLE</div>} </div>
            <div style={{ fontWeight: 'light', fontSize: '14px', opacity: 0.6 }}>{item.artist}—{item.album}</div>
          </div>
          <div className="right">
            <div className="clickable" onClick={() => handleItemClick(item.id)}><IonIcon name="play" /></div>
          </div>
              </div>
            ))}
          </div>
            }


             <style jsx>{`
        .result-container {
          display:flex;
          flex-direction: column;
          gap:20px;
          margin-top:20px;
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
          width:100%;
          border-radius:20px;
          -webkit-user-drag: none;
        }
        .title-badge {
          background-color: var(--nextui-colors-blue600);
          border-radius:5px;
          font-size:10px;
          height:15px;
          padding:2px 5px 0 5px;
        }
        .item .left, .info {
          display:flex;
          flex-direction: column;
          justify-content: center;
          flex-basis: 100%;
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
        }
        `}
      </style>
        </div>
    )
}