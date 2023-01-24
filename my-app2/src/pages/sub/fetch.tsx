import Link from "next/link";
import { useEffect, useState } from "react";

export default function Fetch() {
  const [user, setUser] = useState({ name: null });
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "api/hello")
      .then(res => res.json())
      .then(json => setUser(json))
  }, [])

  return (
    <>
      <h1>/pages/sub/fetch.tsx</h1>
      <p>user name: {user.name}</p>
      <li>
          <Link href='/'>/pages/index.tsx</Link>
      </li>
    </>
  )
}