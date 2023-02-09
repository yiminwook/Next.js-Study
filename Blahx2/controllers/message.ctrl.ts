import { NextApiRequest, NextApiResponse } from 'next';
import messageModel from '@/models/message/message.model';
import BadReqError from './error/bad_request_error';

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const listResp = await messageModel.list({ uid: uidToStr });
  return res.status(200).json(listResp);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body.data;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  if (message === undefined) {
    throw new BadReqError('message 누락');
  }

  await messageModel.post({ uid, message, author });
  return res.status(201).end();
}

const MessageCtrl = {
  post,
  list,
};

export default MessageCtrl;
