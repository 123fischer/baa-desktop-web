'use client';

import { useSession } from 'next-auth/react';

import { getLot } from '@/api/api';

const useAuction = () => {
  const { data: session } = useSession();

  const getAuction = (lotId: string) => {
    const data = getLot({ lotId }, session?.accessToken);
    return data;
  };

  return {
    getAuction,
  };
};

export default useAuction;
