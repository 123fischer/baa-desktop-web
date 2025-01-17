import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export const useRunningAuctionsListener = (
  handler: (docIDs?: string[]) => any
) => {
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
        (snapshot) => {
          if (!initial) {
            handler?.(snapshot.docChanges().map((el) => el.doc.id));
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
