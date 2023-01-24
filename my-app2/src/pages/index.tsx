import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>/pages/index.tsx</h1>
      <ul>
        <li>
          <Link href='/sub'>/pages/sub/index.tsx</Link>
        </li>
        <li>
          <Link href='/sub/about'>/pages/sub/about.tsx</Link>
        </li>
        <li>
          <Link href='/sub/123'>/pages/sub/[id].tsx</Link>
        </li>
      </ul>
    </div>
  )
}
