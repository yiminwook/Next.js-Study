import { InAuthUser } from '../in_auth_user';
import FirebaseAdmin from '@/models/firebase_admin';

const MEMBER_COL = 'members';
const SCR_NAME_COL = 'screen_names';

type AddResult = { result: true; id: string } | { result: false; message: string };
async function add({ uid, email, displayName, photoURL }: InAuthUser): Promise<AddResult> {
  try {
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      //데이터베이스의 모든 변경사항을 한번에 처리하기 위해 transaction을 사용
      const screenName = (displayName as string).replace('@gmail.com', '');
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection(MEMBER_COL).doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection(SCR_NAME_COL).doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      if (memberDoc.exists) {
        //이미 데이터베이스에 있을때 추가 작업없이 바로리턴
        return false;
      }
      const addData = {
        uid,
        email,
        //없는 정보는 ''로 대체한다.
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true;
    });
    if (!addResult) {
      return { result: true, id: uid };
    }
    return { result: true, id: uid };
  } catch (err) {
    console.error(err);
    return { result: false, message: '서버에러' };
  }
}

const memberModel = {
  add,
};

export default memberModel;
