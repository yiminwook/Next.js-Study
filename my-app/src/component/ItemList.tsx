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
    return (
      <>
        <Grid columns={3}>
          <Grid.Row >
            {list.map((item: item, index: number) => (
              <Grid.Column key={index}>
                <Link href={`/view/${item.id}`}>
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