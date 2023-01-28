import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { Input, Grid } from '@nextui-org/react';
import IonIcon from '@reacticons/ionicons';

const SearchBox = ({ initial }) => {
  const router = useRouter();
  const [search, setSearch] = useState(initial || '');

  const handleSubmit = () => {
    if (!search) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div >
      <Input
        className="search-input"
        clearable
        contentRightStyling={false}
        placeholder="검색"
        width="100%"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        contentRight={<div className={'searchBtn'} onClick={handleSubmit}>
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
