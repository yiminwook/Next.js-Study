import { NextApiRequest, NextApiResponse } from 'next';
import MemberModel from '@/models/member/member.model';
import BadReqError from './error/bad_request_error';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  //ajv 라이브러리로 검증이 가능함
  if (uid === undefined || uid === null) {
    throw new BadReqError('uid가 누락되었습니다.');
  }
  if (email === undefined || email === null) {
    throw new BadReqError('email이 누락되었습니다.');
  }
  const addResult = await MemberModel.add({ uid, email, displayName, photoURL });
  if (addResult.result) {
    return res.status(200).json(addResult);
  }
  return res.status(500).json(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;
  if (screenName === undefined || screenName === null) {
    throw new BadReqError('screenName이 누락되었습니다.');
  }
  //query로 배열이 들어 올 수 있기 때문에 처리
  const extractScreenName = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName);
  if (!findResult) {
    //정보가 없으면
    return res.status(404).end();
  }
  return res.status(200).json(findResult);
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;
