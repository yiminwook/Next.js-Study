// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// type Data = {
//   message: string,
// }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(req.cookies);
    res.setHeader("Set-Cookie", "a_name=Mike;Max-Age=0;HttpOnly;Secure");
    res.status(200).json({ message : "ok" });
  }
}
