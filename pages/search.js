import { useRouter } from 'next/router';
import SearchBox from './components/searchBox';
import { useEffect, useState } from 'react';
import Meta from './components/meta';
import { Text, Button } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { playerState } from './states';
import IonIcon from '@reacticons/ionicons';

const SearchPage = (props) => {
  const [player, setPlayer] = useRecoilState(playerState);

  const router = useRouter();
  const q = router.query.q;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!q) return;
    loadData();
  }, [q]);

  const loadData = async () => {
    const res = await fetch(`/api/search?q=${q}`);
    const data = await res.json();
    if (data.ok) {
      setData(data.data);
    } else {
      alert(data.message || '오류가 발생했어요');
    }
  };

  const handleItemClick = (id) => {
    setPlayer(id);
  };

  return (
    <div className="app">
      <Meta title="검색" />
      <Text h3 weight="black">검색</Text>
      <SearchBox initial={q} />
      <div className="result-container">
        {data.map((item) => (
          <div
            className="item"
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
        }
        `}
      </style>
    </div>
  );
};

export default SearchPage;
