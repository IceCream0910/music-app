import { useRouter } from 'next/router';
import SearchBox from './components/searchBox';
import { useEffect, useState } from 'react';
import Meta from './components/meta';
import { Text, Link, Grid, Button } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { playerState } from '../states/states';
import IonIcon from '@reacticons/ionicons';

const SearchPage = (props) => {
  const [player, setPlayer] = useRecoilState(playerState);

  const router = useRouter();
  let q = router.query.q;

  const [trackData, setTrackData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [artistData, setArtistData] = useState([]);

  const [searchRank, setSearchRank] = useState([]);
  const [currentTab, setCurrentTab] = useState(0); // 0: track, 1: album, 2: artist

  useEffect(() => {
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
  };

  const handleItemClick = (id) => {
    setPlayer(id);
  };

  return (
    <div className="app">
      <Meta title={`검색 - ${q}`} />
      <Text h3 weight="black">검색</Text>
      <SearchBox initial={q} />
      <div className="result-container">
        {(!q && searchRank) && <Text h6 weight="light" style={{ marginTop: '20px', marginBottom: '-10px' }}>사람들이 많이 검색하고 있어요🔥</Text>}
        {!q && (
          searchRank.map((item) => (
            <div
              className="item"
              onClick={() => [router.replace(`/search?q=${item.text}`)]}
              style={{ opacity: 0.7 }}
              key={item.rank}>
              {item.text}
            </div>
          )))
        }


        {q &&
          <Grid.Container gap={2} style={{gap: '10px'}}>
            <Button auto color="primary" flat={currentTab === 0 ? false : true} rounded onClick={() => setCurrentTab(0)}>곡</Button>
            <Button auto color="primary" flat={currentTab === 1 ? false : true}  rounded onClick={() => setCurrentTab(1)}>앨범</Button>
            <Button auto color="primary" flat={currentTab === 2 ? false : true}  rounded onClick={() => setCurrentTab(2)}>아티스트</Button>
          </Grid.Container>
        }
        {(q && currentTab == 0) &&
          <div>
            <div className="result-container">
              {trackData.map((item) => (
                <div
                  className="item track"
            key={item.id}>
            <div className="imageContainer">
              <img className="foregroundImg" src={item.image} />
              <img className="backgroundImg" src={item.image} />
            </div>
            <div className="left">
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{item.title}</div>
              <div style={{ fontWeight: 'light', fontSize: '14px', opacity: 0.6 }}>{item.artist}—{item.album}</div>
            </div>
            <div className="right">
              <div className="clickable" onClick={() => handleItemClick(item.id)}><IonIcon name="play" /></div>
            </div>
                </div>
              ))}
            </div>
          </div>
        }

        {(q && currentTab == 1) &&
          <div>
            <Grid.Container gap={2} justify="space-between">
              {albumData.map((item) => (
                <Grid xs className="album"
                  onClick={() => router.push(`/album/${item.id}`)}
                  key={item.id} style={{ flexDirection: 'column' }}>
                  <img style={{ borderRadius: '20px', marginBottom: "10px" }} src={item.image} />
                  <div className='info' style={{ margin: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{item.title}</div>
                    <div style={{ fontWeight: 'light', fontSize: '14px', opacity: 0.6 }}>{item.albumTypeStr} | {item.artist}</div>
                  </div>
                </Grid>
              ))}
            </Grid.Container>
          </div>
        }

        {(q && currentTab == 2) &&
          <div>
            <Grid.Container gap={2} justify="space-between">
              {artistData.map((item) => (
                <Grid xs className="album"
                  key={item.id} style={{ flexDirection: 'column' }}>
                    <img style={{ borderRadius: '20px', marginBottom: "10px" }} src={item.image} />
                  <div className='info' style={{ margin: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>{item.name}</div>
                  </div>
                </Grid>
              ))}
            </Grid.Container>
          </div>
        }
      </div>


      <style jsx>{`
        .result-container {
          display:flex;
          flex-direction: column;
          gap:20px;
          margin-top:20px;
        }
        .album-container {
          display:flex;
          flex-direction: row;
          gap:20px;
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
          width:50px;
          min-width:50px;
          border-radius:10px;
          -webkit-user-drag: none;
        }
        .album img {
          width:50%;
          border-radius:20px;
          -webkit-user-drag: none;
        }
        .artist img {
          width:50%;
          border-radius:50%;
          -webkit-user-drag: none;
        }
        .item .left, .info {
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
        }
        `}
      </style>
    </div >
  );
};

export default SearchPage;
