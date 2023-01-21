/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Item from "@/component/Item";
import Head from "next/head";

//static page
export default function Post({ item, name }: any) {
  return (
      <>  
        {item && (
          <>
            <Head>
              <title>{item.name}</title>
              
              {/* 검색엔진 최적화, 항상 가격이나 상품설명이 최신화됌 */}
              <meta name="description" content={item.description}></meta> 
            </Head>
            <div>{name} 환경입니다.</div>
            <Item item={item} />
           </>
        )}
      </> 
    )
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: "495"} },
      { params: { id: "488"} },
      { params: { id: "477"} },
    ],
    fallback: false 
    //params에 없는 페이지가 있으면 서버에서 정적 페이지(static html)를 새로 생성한다.
  };
}

export async function getStaticProps(context: any) {
  const id = context.params.id;
  const API_URI = process.env.NEXT_PUBLIC_API_KEY + `products/${id}.json` || "";
  const res = await axios.get(API_URI);
  const data = res?.data;

  return {
    props: {
      item: data,
      //server쪽에서 동작하기 때문에 NEXT_PUBLIC_을 붙이지 않아도 된다.
      name :process.env.name
    }
  };
}