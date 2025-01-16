import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/api/auth/[...nextauth]/firebase';
import { Auction } from '@/types/types';

export const useAuctionListener = (
  id: Auction['id'] | undefined,
  handler: () => any
) => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.accessToken) {
      if (!id) {
        return;
      }
      let initial = true;
      const unsubscribe = onSnapshot(
        query(collection(db, 'auction'), where('id', '==', id)),
        (snapShot) => {
          if (!initial) {
            handler();
          } else {
            initial = false;
          }
        }
      );

      return () => unsubscribe();
    }
  }, [id, session?.accessToken]); // eslint-disable-line

  return;
};
