import { Grid, Image } from "semantic-ui-react";
import style from '@/styles/itemList.module.css';
import Link from "next/link";

interface item {
  id: number,
  image_link: string,
  name: string,
  price: number,
  category: string,
  product_type: string
}

export default function ItemList({ list }: any) {
  //Link는 기본적으로 preFetch가 true로 설정되어있어 보이는 화면의 리소스를 미리 받아온다. 빌드후에 사용가능
  //passHref href 속성을 하위 컴포넌트로 전달 검색엔진, 사용자 기능 최적화

    return (
      <>
        <Grid columns={3}>
          <Grid.Row >
            {list.map((item: item, index: number) => (
              <Grid.Column key={index}>
                <Link 
                  href={"/detail/[id]"} 
                  as={`/detail/${item.id}`}
                  passHref
                  prefetch={false} 
                >
                <div className={style.wrap}>
                  <Image 
                    className={style.img_item} 
                    src={item.image_link} 
                    alt={item.name} 
                  />
                  <strong className={style.tit_item}>
                    {item.name}
                  </strong>
                  <span className={style.txt_info}>
                    {item.category} {item.product_type}
                  </span>
                  <strong className={style.num_price}>${item.price}</strong>
                </div>
                </Link>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </>
    )
  }