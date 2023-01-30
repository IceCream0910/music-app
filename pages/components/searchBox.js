import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { Input, Grid } from '@nextui-org/react';
import IonIcon from '@reacticons/ionicons';
import { debounce } from 'lodash';

const SearchBox = ({ initial }) => {
  const router = useRouter();
  const [search, setSearch] = useState(initial || '');


  const handleSubmit = useCallback(debounce((query) => {
    if (!query) {
      router.replace(`/search`);
    } else {
      router.replace(`/search?q=${encodeURIComponent(query)}`);
    }
  }, 450), []);

  return (
    <div >
      <Input
        className="search-input"
        clearable
        contentRightStyling={false}
        placeholder="검색"
        width="100%"
        initialValue={initial || ''}
        onChange={(e) => [setSearch(e.target.value), handleSubmit(e.target.value)]}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e.target.value);
          }
        }}
        contentLeft={<div className={'searchBtn'}>
          <IonIcon className={'icon'} name="search-outline"></IonIcon>
        </div>}
      />
      <style jsx>{`
      .searchBtn {
        cursor: pointer;
        margin:10px;
        margin-top:15px;
      }
        `}
      </style>
    </div>
  );
};

export default SearchBox;
