import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

const handleError = (err: unknown, res: NextApiResponse) => {
  let unknownErr = err;
  if (err instanceof CustomServerError === false) {
    //err가 CustomServerError에서 정의되지 않은 인스턴스일때 새로운 인스턴스를 생성
    unknownErr = new CustomServerError({ statusCode: 499, message: 'unknown error' });
  }
  const customErr = unknownErr as CustomServerError;
  return res
    .status(customErr.statusCode)
    .setHeader('location', customErr.location ?? '') //리다이렉션 없으면 안쓴다.
    .send(customErr.serializeErrors());
};

export default handleError;
