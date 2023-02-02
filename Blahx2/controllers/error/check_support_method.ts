import CustomServerError from './custom_server_error';

export default function checkSupportMethod(suportMethod: string[], method: string) {
  if (suportMethod.indexOf(method) === -1) {
    throw new CustomServerError({ message: '지원되지 않는 Method' });
  }
}
