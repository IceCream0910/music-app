import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Input} from '@nextui-org/react';
import IonIcon from '@reacticons/ionicons';
import {debounce} from 'lodash';

const SearchBox = ({initial}) => {
    const router = useRouter();
    const [search, setSearch] = useState(initial || '');
    const [autocomplete, setAutocomplete] = useState([]);
    const [isFocus, setIsFocus] = useState(false);


    const handleSubmit = useCallback(debounce((query) => {
        if (!query) {
            router.replace(`/search`);
        } else {
            loadAutocomplete(query)
        }
    }, 450), []);

    const loadAutocomplete = async (query) => {
        const res = await fetch(`https://www.music-flo.com/api/search/v2/search/instant?keyword=${encodeURIComponent(query)}`)
        const data = await res.json();
        if (data.data.list[0].list) {
            setAutocomplete(data.data.list[0].list);
            console.log(data.data.list[0].list)
        }
    };

    return (
        <div>
            <Input
                className="search-input"
                clearable
                contentRightStyling={false}
                placeholder="검색"
                width="100%"
                onFocus={() => setIsFocus(true)}
                onBlur={() => {
                    setTimeout(() => {
                        setIsFocus(false)
                    }, 200)
                }}
                onChange={(e) => [setSearch(e.target.value), handleSubmit(e.target.value)]}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.push(`/search?q=${encodeURIComponent(e.target.value)}`)
                        setIsFocus(false)
                    }
                }}
                contentLeft={<div className={'searchBtn'}>
                    <IonIcon className={'icon'} name="search-outline"></IonIcon>
                </div>}
            />

            {(search && isFocus) &&
                <div className={'autocomplete'}>
                    {autocomplete.map((item, index) => (
                        <div key={index} className='item'
                             onClick={() => [router.push(`/search?q=${encodeURIComponent(item.text)}`), setSearch(item.text)]}>{item.text}</div>
                    ))}
                </div>
            }


            <style jsx>{`
              .searchBtn {
                cursor: pointer;
                margin: 10px;
                margin-top: 15px;
              }

              .autocomplete {
                position: fixed;
                top: 100px;
                left: 0;
                width: 100%;
                z-index: 99999;
                background: var(--nextui-colors-backgroundAlpha);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 20px;
                max-height: 30vh;
                overflow-y: scroll;
              }

              .autocomplete .item {
                padding: 10px;
              }
            `}
            </style>
        </div>
    );
};

export default SearchBox;
