import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/api/auth/[...nextauth]/firebase';

export const useRunningAuctionsListener = (handler: () => any) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      let initial = true;
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'auction'),
          where('active', '==', true),
          where('endsAt', '>', Timestamp.now())
        ),
        () => {
          if (!initial) {
            handler?.();
          } else {
            initial = false;
          }
        }
      );
      return () => unsubscribe();
    }
  }, [session?.accessToken]); // eslint-disable-line

  return;
};
