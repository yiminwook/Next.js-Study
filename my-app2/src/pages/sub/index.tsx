import Link from "next/link";
import { useRouter } from "next/router";

export default function SubIndex() {
  const router = useRouter();
  console.log(router)
  return (
    <>
      <h1>/pages/sub/index.tsx</h1>
      <ul>
        <li>
          <Link href='/'>/pages/index.tsx</Link>
        </li>
      </ul>
    </>
  )
}