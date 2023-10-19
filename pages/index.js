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
    const itemsToShow = 3;
    const moreAlbums = newestAlbums.slice(itemsToShow);

    useEffect(() => {
        setLoading(true);
        loadNewestAlbums();
    }, []);

    const loadNewestAlbums = async () => {
        const res = await fetch(`/api/newestAlbum`);
        const data = await res.json();
        if (data.ok) {
            setNewestAlbums(data.data);
        }
        setLoading(false);
    };

    const toggleShowMoreNewestAlbum = () => {
        setShowMoreNewestAlbum((prevShowMore) => !prevShowMore);
    };

    return (
        <div className="app">
            <Meta title="홈"/>
            <Text h3 weight="black">홈</Text>
            <br></br>
            <Text h4 weight="black">최근에 발매된 앨범</Text>
            <Spacer y={0.75}/>
            <div className={'container-3x1'}>
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
