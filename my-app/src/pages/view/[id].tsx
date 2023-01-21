/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Item from "@/component/Item";
import { Loader } from "semantic-ui-react";

export default function Post() {
  
  const router = useRouter();
  const { id } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_KEY + `products/${id}.json` || "";
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(id && +id > 0) {
      setIsLoading(true);
      axios.get(API_URL)
      .then(res => {
        setItem(res.data);
        setIsLoading(false);
      })
      .catch(err => setIsLoading(false))
    }
  }, [id])

  return (
      <>
        {isLoading ? (
          <div style={{ display: "absoulte", padding: "300px"}}>
            <Loader inline="centered" active>
              Loading
            </Loader>
          </div>
        ) : (
          <Item item={item} />
          )}
      </> 
    )
};
