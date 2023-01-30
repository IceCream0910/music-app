import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Text, Link, Grid, Button } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { playerState, currentSongIdState } from '../../states/states';
import IonIcon from '@reacticons/ionicons';

export default function TrackItem({ item }) {

  const [player, setPlayer] = useRecoilState(playerState);
  const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

  const handleItemClick = (id) => {
    setPlayer([...player, id]);
    setCurrentSongId(id);
  };

  return (
    <>
      <div
        className="item track"
        key={item.id || ''}>
        <div className="imageContainer">
          <img className="foregroundImg" src={item.image || ''} />
          <img className="backgroundImg" src={item.image || ''} />
        </div>
        <div className="left">
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{item.title || ''}</div>
          <div style={{ fontWeight: 'light', fontSize: '14px', opacity: 0.6 }}>{item.artist || ''}—{item.album || ''}</div>
        </div>
        <div className="right">
          <div className="clickable" onClick={() => handleItemClick(item.id  || '')}><IonIcon name="play" /></div>
        </div>
      </div>
    </>
  )
}
