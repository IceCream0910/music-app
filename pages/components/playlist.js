import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {currentSongIdState, isPlaylistOpenedState, loadingState, playerState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {Text} from '@nextui-org/react';
import {BottomSheet} from 'react-spring-bottom-sheet'

export default function Playlist() {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [isPlaylistOpened, setIsPlaylistOpened] = useRecoilState(isPlaylistOpenedState);
    const [playlistData, setPlaylistData] = useState([]);

    const [isLongPressed, setIsLongPressed] = useState(false);


    useEffect(() => {
        if (isPlaylistOpened) {
            setPlaylistData([]);
            setLoading(true);
            setLoading(false);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [isPlaylistOpened]);


    const [isOpen, setIsOpen] = useState(false);

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
        <div>
            <BottomSheet open={isOpen} expandOnContentDrag={false}
                         snapPoints={({minHeight}) => minHeight}
                         onDismiss={() => [setIsOpen(false), setIsPlaylistOpened(false)]}
                         header={<Text h4>재생목록</Text>}
                         footer={<></>}>

                <div className={'bottomSheet'}>
                    {playlistData && playlistData.map((item, index) => (
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
                    ))}
                </div>

            </BottomSheet>

            <style jsx>
                {`.bottomSheet {
                  padding: 20px;
                  height: 100%;
                  overflow-y: scroll;
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
                  margin-bottom: 10px;
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
                `}
            </style>
        </div>
    )

};