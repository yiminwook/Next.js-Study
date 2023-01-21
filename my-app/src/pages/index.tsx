/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import Head from 'next/head';
import ItemList from '@/component/ItemList';
import { Header, Divider, Loader } from 'semantic-ui-react';

export default function Home({ list } :any) {

  return (
    <div>
    <Head>
      <title>&gt; HOME Study Next JS </title>
      <meta name="description" content='Hello Next JS HOME'></meta>
    </Head>
      <>
        <Header as="h3" style={{ paddingTop: "20px" }}>
          베스트 상품
        </Header>
        <Divider />
        <ItemList list={list.slice(0, 9)} />
        <Header as="h3" style={{ paddingTop: "20px" }}>
          신상품
        </Header>
        <Divider />
        <ItemList list={list.slice(9)} />
      </>
    </div>
  );
}

export async function getStaticProps() {
  //server에서 환경변수를 사용
  const API_URL = process.env.API_KEY + "products.json?brand=maybelline" || "";
  const res = await axios.get(API_URL);
  const data = res?.data;

  return {
    props: {
      list: data,
      name: process.env.name,
    },
  };
}
