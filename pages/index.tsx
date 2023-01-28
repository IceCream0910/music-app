import { NextPage } from 'next';
import Meta from './components/meta';
import { Text } from "@nextui-org/react";


const IndexPage: NextPage = () => {
  return (
    <div className="app">
      <Meta title="홈" />
      <Text h3 weight="black">홈</Text>
    </div>
  );
};

export default IndexPage;
