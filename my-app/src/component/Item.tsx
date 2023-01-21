import { Image, Header, Divider } from "semantic-ui-react";
import style from '@/styles/item.module.css';

export default function Item({ item }: any) {
  const { image_link, name, price, description, category, product_type } = item;
  return (
    <>
      <div className={style.wrap}>
        <div className={style.img_item}>
            <Image src={image_link} alt={name} width="auto"/>
        </div>
        <div className={style.info_item}>
          <strong className={style.tit_item}>{name}</strong>
          <strong className={style.num_price}>${price}</strong>
          <span className={style.txt_info}>
            {category ? `${category}/` : ""}
            {product_type}
          </span>
          <div className={style.button_area}>
            <button className={style.button_item}>구매하기</button>
          </div>
        </div>
      </div>
      <Divider />
      <Header as="h3">Description</Header>
      <p className={style.item_desc}>{description}</p>
      <Divider />
    </>
  )
}