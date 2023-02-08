import { InAuthUser } from '../in_auth_user';
import FirebaseAdmin from '@/models/firebase_admin';

const MEMBER_COL = 'members';
const SCR_NAME_COL = 'screen_names';

type AddResult = { result: true; id: string } | { result: false; message: string };
async function add({ uid, email, displayName, photoURL }: InAuthUser): Promise<AddResult> {
  try {
    const addResult = await FirebaseAdmin.getInstance().Firestore.runTransaction(async (transaction) => {
      //데이터베이스의 모든 변경사항을 한번에 처리하기 위해 transaction을 사용
      const screenName = email!.replace('@gmail.com', '');
      //add()문서를 랜덤으로 생성
      //doc()문서를 지정해서 생성
      const memberRef = FirebaseAdmin.getInstance().Firestore.collection(MEMBER_COL).doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firestore.collection(SCR_NAME_COL).doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      if (memberDoc.exists) {
        //이미 데이터베이스에 있을때 추가 작업없이 바로리턴
        return false;
      }
      const addData = {
        uid,
        email,
        //?? 앞에 오는 값이 null 또는 undefined이면 뒤에오는 값을, 아니면 null 또는 undefined을 반환
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

async function findByScreenName(screenName: string): Promise<InAuthUser | null> {
  const memberRef = FirebaseAdmin.getInstance().Firestore.collection(SCR_NAME_COL).doc(screenName);
  const memberDoc = await memberRef.get();
  if (memberDoc.exists === false) {
    return null;
  }
  const data = memberDoc.data() as InAuthUser;
  return data;
}

const MemberModel = {
  add,
  findByScreenName,
};

export default MemberModel;
