import { NextApiRequest, NextApiResponse } from 'next';
import messageModel from '@/models/message/message.model';
import BadReqError from './error/bad_request_error';
import CustomServerError from './error/custom_server_error';
import FirebaseAdmin from '@/models/firebase_admin';

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
  const { uid, message, author } = req.body;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  if (message === undefined) {
    throw new BadReqError('message 누락');
  }

  await messageModel.post({ uid, message, author });
  return res.status(201).end();
}

/** 작성자만 비공개 처리가 가능 */
async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다.' });
  }
  let tokenUid: null | string = null;
  try {
    const decode = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    tokenUid = decode.uid;
  } catch (err) {
    throw new BadReqError('token에 문제가 있습니다.');
  }
  const { uid, messageId, deny } = req.body;
  if (uid === undefined) {
    throw new BadReqError('uid 누락');
  }
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다.' });
  }
  if (messageId === undefined) {
    throw new BadReqError('messageId 누락');
  }
  if (deny === undefined) {
    throw new BadReqError('deny 누락');
  }
  const result = await messageModel.updateMessage({ uid, messageId, deny });
  return res.status(200).json(result);
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body;
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
  list,
  post,
  updateMessage,
  getReply,
  postReply,
};

export default MessageCtrl;
