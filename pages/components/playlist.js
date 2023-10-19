import {useRouter} from 'next/router';
import {useRecoilState} from 'recoil';
import {currentSongIdState, loadingState, playerState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {Spacer, Text} from '@nextui-org/react';

export default function Playlist() {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);
    const [loading, setLoading] = useRecoilState(loadingState);

    const handleItemClick = (id) => {
        const currentIndex = player.findIndex((item) => item.id === id);
        const updatedPlaylistData = player.slice(currentIndex);
        console.log(updatedPlaylistData)
        setPlayer(updatedPlaylistData);
        setCurrentSongId(id);
    };


    return (
        <div className="lyrics-container">
            <Text h3>재생목록</Text>
            <Spacer y={1}/>
            {player && player.map((item, index) => {
                if (!item.id) return;
                return (
                    <div className="item track"
                         key={index}>
                        <div className="left" onClick={() => handleItemClick(item.id)}>
                            <div style={{fontWeight: 'bold', fontSize: '18px'}}>{item.title}</div>
                            <div style={{
                                fontWeight: 'light',
                                fontSize: '14px',
                                opacity: 0.6
                            }}>{item.artist}</div>
                        </div>
                        <div className="right">
                            <div className="clickable"><IonIcon name="reorder-two"/></div>
                        </div>
                    </div>
                )
            })
            }


            <style jsx>
                {`
                  .lyrics-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    padding: 20px;
                    padding-top: 60px;
                    background-color: rgba(0, 0, 0, 0.2);
                    z-index: 9;
                    backdrop-filter: blur(50px);
                  }

                  .item {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    margin-bottom: 10px;
                  }

                  .item .left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex-basis: 100%;
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
    )

};