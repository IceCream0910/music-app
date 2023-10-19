import Meta from './components/meta';
import {Button, Spacer, Text} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {loadingState} from "../states/states";
import {useRouter} from "next/router";
import IonIcon from "@reacticons/ionicons";

const IndexPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useRecoilState(loadingState);
    const [newestAlbums, setNewestAlbums] = useState([]);
    const [showMoreNewestAlbum, setShowMoreNewestAlbum] = useState(false);
    const itemsToShow = 4;
    const moreAlbums = newestAlbums.slice(itemsToShow);

    const [recommendPanel, setRecommendPanel] = useState([]);

    useEffect(() => {
        setLoading(true);
        loadNewestAlbums();
        loadRecommendPanel();
    }, []);

    const loadNewestAlbums = async () => {
        const res = await fetch(`/api/newestAlbum`);
        const data = await res.json();
        if (data.ok) {
            setNewestAlbums(data.data);
        }
        setLoading(false);
    };

    const loadRecommendPanel = async () => {
        const res = await fetch(`/api/recommend`);
        const data = await res.json();
        if (data.ok) {
            setRecommendPanel(data.data);
        }
        setLoading(false);
    };

    const toggleShowMoreNewestAlbum = () => {
        setShowMoreNewestAlbum((prevShowMore) => !prevShowMore);
    };

    function randomPanel(recommendPanel) {
        if (recommendPanel.length <= 1) {
            return recommendPanel[0]; // 배열의 크기가 1 이하면 그 요소를 반환
        }

        // 배열의 마지막 요소를 제외한 나머지 요소를 새 배열에 복사
        const remainingItems = recommendPanel.slice(0, recommendPanel.length - 1);

        // 나머지 요소 중에서 무작위로 하나를 선택
        const randomIndex = Math.floor(Math.random() * remainingItems.length);
        const selectedRandomItem = remainingItems[randomIndex];

        return selectedRandomItem; // 무작위로 선택한 요소 반환
    }

    const displayedPanelData = randomPanel(recommendPanel);

    return (
        <div className="app">
            <Meta title="홈"/>
            <Text h3 weight="black">홈</Text>

            <Spacer y={0.75}/>
            {recommendPanel && displayedPanelData && (
                <>
                    <Text h4 weight="black"
                          style={{
                              position: 'absolute',
                              top: '90px',
                              left: '40px',
                              right: '40px',
                              zIndex: '9'
                          }}>{displayedPanelData.title}</Text>
                    <div className={'recommend-panel'}
                         style={{backgroundImage: `url(${displayedPanelData.content.trackList[0].album.imgList[5].url})`}}>

                    </div>
                </>
            )}


            <Spacer y={2.5}/>
            <Text h4 weight="black">최근에 발매된 앨범</Text>
            <Spacer y={0.75}/>
            <div className={'container-2x1'}>
                {newestAlbums.slice(0, showMoreNewestAlbum ? newestAlbums.length : itemsToShow).map((item) => (
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


            {newestAlbums.length > itemsToShow && (
                <div className="show-more-button"
                     style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Button color="white" className={'icon-btn'} flat={true} rounded
                            onClick={(e) => {
                                setTimeout(() => {
                                    toggleShowMoreNewestAlbum();
                                }, 200);
                            }}>
                        {showMoreNewestAlbum ? <><IonIcon name={'chevron-up'}/>&nbsp;&nbsp;접기</> : <><IonIcon
                            name={'chevron-down'}/>&nbsp;&nbsp;더보기</>}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default IndexPage;
