/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ItemList from '@/component/ItemList';
import { Header, Divider, Loader } from 'semantic-ui-react';

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_KEY + "products.json?brand=maybelline" || "";
  const [list, setList] = useState([]);
  const [isLoding, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(API_URL)
     .then(res => {
      setList(res.data);
      setIsLoading(false);
    })
      .catch(err => {
        setIsLoading(false);
      })
  }, [])

  return (
    <div>
    <Head>
      <title>&gt; HOME Study Next JS </title>
      <meta name="description" content='Hello Next JS HOME'></meta>
    </Head>
      {isLoding ? (
        <div style={{ display: "absoulte", padding: "300px"}}>
          <Loader inline="centered" active>
            Loading
          </Loader>
        </div>
      ) : (
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
      )}
    </div>
  );
}
