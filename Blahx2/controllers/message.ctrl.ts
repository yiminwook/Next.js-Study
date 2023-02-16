import { NextApiRequest, NextApiResponse } from 'next';
import messageModel from '@/models/message/message.model';
import BadReqError from './error/bad_request_error';

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid, page, size } = req.query;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  const convertPage = page === undefined ? '1' : page;
  const convertSize = size === undefined ? '10' : size;
  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const pageToStr = Array.isArray(convertPage) ? convertPage[0] : convertPage;
  const sizeToStr = Array.isArray(convertSize) ? convertSize[0] : convertSize;
  const listResp = await messageModel.listWithPage({ uid: uidToStr, page: +pageToStr, size: +sizeToStr });
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

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body.data;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadReqError('messageId 누락');
  }
  if (reply === undefined) {
    throw new BadReqError('reply 누락');
  }

  await messageModel.postReply({ uid, messageId, reply });
  return res.status(201).end();
}

async function getReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadReqError('messageId 누락');
  }
  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const messageIdToStr = Array.isArray(messageId) ? messageId[0] : messageId;
  const data = await messageModel.getReply({ uid: uidToStr, messageId: messageIdToStr });
  return res.status(200).json(data);
}

const MessageCtrl = {
  post,
  list,
  getReply,
  postReply,
};

export default MessageCtrl;
