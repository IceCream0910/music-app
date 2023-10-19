import {BottomSheet} from 'react-spring-bottom-sheet'
import {useRecoilState} from 'recoil';
import {infoModalDataState, isInfoModalOpenedState, playerState} from '../../states/states';
import {Spacer} from "@nextui-org/react";
import IonIcon from "@reacticons/ionicons";
import toast, {Toaster} from "react-hot-toast";
import {useRouter} from "next/router";

export default function SongInfoModal() {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [infoModalData, setInfoModalData] = useRecoilState(infoModalDataState);
    const [isInfoModalOpened, setIsInfoModalOpened] = useRecoilState(isInfoModalOpenedState);


    return (
        <div>
            <BottomSheet open={isInfoModalOpened} expandOnContentDrag={false}
                         snapPoints={({minHeight}) => minHeight}
                         onDismiss={() => [setIsInfoModalOpened(false)]}
                         header={<>
                             <div className="item"
                                  key={infoModalData.id}>
                                 <div className="imageContainer">
                                     <img className="foregroundImg" src={infoModalData.image}/>
                                     <img className="backgroundImg" src={infoModalData.image}/>
                                 </div>
                                 <div className="left">
                                     <div style={{fontWeight: 'bold', fontSize: '18px'}}>{infoModalData.title}</div>
                                     <div style={{
                                         fontWeight: 'light',
                                         fontSize: '14px',
                                         opacity: 0.6
                                     }}>{infoModalData.artist}</div>
                                 </div>
                             </div>
                         </>}
                         footer={<></>}
            >

                <div className={'song-info-modal'}>
                    <button onClick={() => {
                        setPlayer([...player, {
                            id: infoModalData.id,
                            title: infoModalData.title,
                            artist: infoModalData.artist,
                        }]);
                        toast('바로 다음에 이 곡을 재생할게요');
                        setIsInfoModalOpened(false);
                    }}>
                        <IonIcon name="list" style={{position: "relative", top: '-2px'}}/>
                        바로 다음에 재생
                    </button>
                    <Spacer y={0.5}/>
                    <button onClick={() => {
                        router.push(`/album/${infoModalData.albumId}`);
                        setIsInfoModalOpened(false);
                    }}>
                        <IonIcon name="folder-outline" style={{position: "relative", top: '-2px'}}/>
                        이 곡이 수록된 앨범 보기
                    </button>
                    <Spacer y={0.5}/>
                    <button onClick={() => {
                        router.push(`/artist/${infoModalData.artistId}`);
                        setIsInfoModalOpened(false);
                    }}>
                        <IonIcon name="person-outline" style={{position: "relative", top: '-2px'}}/>
                        아티스트 보기
                    </button>
                    <Spacer y={1}/>
                </div>

            </BottomSheet>
            <Toaster/>
            <style jsx>
                {`
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
                    justify-content: flex-start;
                  }

                  .item {
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: nowrap;
                  }

                  .imageContainer {
                    position: relative;
                    left: 10px;
                    width: 50px;
                    height: 50px;
                  }

                  .imageContainer .foregroundImg {
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    pointer-events: none;
                    border-radius: 10px;
                  }

                  .imageContainer .backgroundImg {
                    position: absolute;
                    top: 5px;
                    left: 0;
                    filter: blur(4px);
                    z-index: 1;
                    border-radius: 10px;
                  }

                  .item .left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-content: center;
                    text-align: left;
                    margin-left: 30px;
                    margin-right: 10px;
                    line-height: 1.2;
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