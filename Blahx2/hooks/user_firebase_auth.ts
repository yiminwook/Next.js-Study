import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import axios from 'axios';
import { InAuthUser } from '@/models/in_auth_user';
import FirebaseClient from '@/models/firebase_client';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);
    /** 언마운트될때 동작 **/
    return () => unsubscribe();
  }, []);

  async function authStateChanged(authState: User | null) {
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      // eslint-disable-next-line no-useless-return
      return;
    }

    setLoading(true);
    setAuthUser({
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
      uid: authState.uid,
    });
    setLoading(false);
  }

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      if (signInResult.user) {
        const { uid, photoURL, displayName, email } = signInResult.user;
        await axios.post(
          '/api/member.add',
          {
            uid,
            photoURL,
            displayName,
            email,
          },
          { headers: { 'Content-Type': 'application/json' } },
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  /** 로그아웃후 초기화 작업 **/
  async function clear() {
    setAuthUser(null);
    setLoading(true);
  }

  async function signOut() {
    try {
      await FirebaseClient.getInstance().Auth.signOut();
      await clear();
    } catch (err) {
      console.error(err);
    }
  }

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}
