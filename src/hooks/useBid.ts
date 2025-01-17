import {  useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';

import { onPlaceBid } from '@/api/api';
import useAuctions from './useAuctions';

type BidBody = {
  id: string;
  manual: boolean;
  currentBid: number;
};

const useBid = () => {
  const { data: session } = useSession();
  const [showBidModal, setShowBidModal] = useState(false);
  const [successfulBid, setSuccessfulBid] = useState(false);
  const [unSuccessfulBid, setUnSuccessfulBid] = useState(false);
  const [outBid, setOutBid] = useState(false);
  const { refetch } = useAuctions();

  const {
    mutate: placeBid,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (body: BidBody) =>
      onPlaceBid(
        {
          bid: body.currentBid,
          lotId: body.id ?? '',
          manual: body.manual,
        },
        session?.accessToken
      ),
    onSuccess(data) {
      setShowBidModal(false);
      if (data?.outbid) {
        setOutBid(true);
        refetch();
      } else if (data?.success) {
        setSuccessfulBid(true);
        refetch();
      } else {
        setUnSuccessfulBid(true);
      }
    },
    onError(e) {
      throw new Error(e.message);
    },
  });

  return {
    placeBid,
    isPending,
    isSuccess,
    showBidModal,
    successfulBid,
    unSuccessfulBid,
    outBid,
    setShowBidModal,
    setSuccessfulBid,
    setUnSuccessfulBid,
    setOutBid,
  };
};

export default useBid;
