/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { InAuthUser } from '@/models/in_auth_user';
import useFirebaseAuth from '@/hooks/user_firebase_auth';

interface InAuthUserContext {
  authUser: InAuthUser | null;
  /** 로그인 여부가 진행중인지 체크 **/
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

//redux와 어떤차이?
//createContext안에 역할? 지워도 잘 동작
const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

//createContext provider value둘중 어떤게 초기값??
export const AuthUserProvider = function ({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};

export const useAuth = () => useContext(AuthUserContext);
