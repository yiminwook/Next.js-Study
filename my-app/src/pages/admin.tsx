/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

export default function Admin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  function checkLogin() {
    axios.get("/api/isLogin")
      .then(res => {
        const { status, data } = res;
        if (!data.name) {
          console.log("is not login");
          router.push("/login");
        }
        setIsLogin(true);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    checkLogin();
  }, [isLogin]);

  async function logout() {
    try {
      const option = {
        header: { "Content-Type": "application/json" },
        withCredentials: true,
      }
      const result = await axios.post('/api/logout', option);
      console.log("logout");
      //로그아웃하면 첫페이지로
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h3>admin</h3>
      <div style={{ padding: "40px 0px 100px"}}>
        {isLogin && 
          <div style={{ textAlign: "center" }}>
            <Button 
              color="orange" 
              onClick={logout}
            >
              logout
            </Button>
          </div>
        }
      </div>
    </>
  )
}