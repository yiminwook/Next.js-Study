/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Header } from "semantic-ui-react";
import Gnb from "./Gnb";
export default function Top() {
  return (
    <>
      <Link href="/">
        <div style={{ display: "flex", paddingTop: "10px" }}>
          <div style={{ flex: "100px 0 0"}}>
            <img 
              src="/images/next.svg" 
              alt="logo"
              style={{ display: "block", padding: "30px 10px 0px 10px" }} 
            />
          </div>
          <Header as="h1" style={{ marginLeft: "30px" }}>Hello Next JS!</Header>
        </div>
      </Link>
      <Gnb />
    </>
  )
}