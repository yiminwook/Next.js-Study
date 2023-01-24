import Link from "next/link";
import { useRouter } from "next/router"

export default function Id() {
  const router = useRouter();
  const id = Number(router.query.id);
  return (
    <>
      <h1>/pages/sub/[id].tsx</h1>
      <p>Parameter id: {id}</p>
      <ul>
        <li>
          <Link href='/'>/pages/index.tsx</Link>
        </li>
      </ul>
    </>
  )
}