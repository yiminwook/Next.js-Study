import { NextApiRequest, NextApiResponse } from 'next';
import memberModel from '@/models/member/member.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body.data;
  if (uid === undefined || uid === null) {
    return res.status(400).json({ result: false, message: 'uid가 누락되었습니다.' });
  }
  if (email === undefined || email === null) {
    return res.status(400).json({ result: false, message: 'email가 누락되었습니다.' });
  }
  const addResult = await memberModel.add({ uid, email, displayName, photoURL });
  if (addResult.result) {
    return res.status(200).json(addResult);
  }
  return res.status(500).json(addResult);
}
