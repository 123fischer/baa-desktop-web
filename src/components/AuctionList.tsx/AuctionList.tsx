'use client';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { onPlaceBid } from '@/api/api';

import StarOutlineIcon from 'public/icons/starOutline.svg';
import StarSolidIcon from 'public/icons/starSolid.svg';

import useCarAuction from '@/hooks/useCarAuction';
import { Button } from '@/components/UI/Button';
import BidModal from '../Modals/BidModal';
import UnSuccessfulBidModal from '../Modals/UnSuccessfulBidModal';
import SuccessfulBidModal from '../Modals/SuccessfulBidModal';
import OutBidModal from '../Modals/OutBidModal';

import { formatNumber } from '@/utils/utlis';
import { usePageInfiniteLoader } from '@/hooks/hooks';
import LoadingComponent from '../UI/Loading';
import { Auction } from '@/types/types';
import { useFilters } from '@/contexts/FilterContext';

const AuctionList = () => {
  const {
    auctions,
    onToggleFavorite,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useCarAuction();
  const { filters } = useFilters();
  const { data: session } = useSession();
  const [showBidModal, setShowBidModal] = useState(false);
  const [successfulBid, setSuccessfulBid] = useState(false);
  const [unSuccessfulBid, setUnSuccessfulBid] = useState(false);
  const [outBid, setOutBid] = useState(false);
  const [currentBid, setCurrentBid] = useState(100);
  const [useBidAgent, setUseBidAgent] = useState(false);
  const [bidDetails, setBidDetails] = useState<Auction | null>(null);
  const [auctionsTimeLeft, setAuctionsTimeLeft] = useState<
    {
      id: string;
      timeLeft: string;
    }[]
  >([]);

  const onCountDown = (auctionId: string, endsAt: Date) => {
    const now = dayjs();
    const duration = dayjs(endsAt).diff(now);
    if (duration <= 0) {
      return {
        id: auctionId,
        timeLeft: `-d-hh-mm-ss`,
      };
    } else {
      const days = dayjs(endsAt).diff(now, 'days');
      const hours = dayjs(endsAt).diff(now, 'hours') % 24;
      const minutes = dayjs(endsAt).diff(now, 'minutes') % 60;
      const seconds = dayjs(endsAt).diff(now, 'seconds') % 60;

      return {
        id: auctionId,
        timeLeft: `-${days}-${hours}-${minutes}-${seconds}`,
      };
    }
  };

  useEffect(() => {
    if (auctions) {
      const intervalId = setInterval(() => {
        const auctionsEndTimes = auctions?.map((auction) => ({
          id: auction.id,
          endsAt: auction.endsAt,
        }));
        const Auctions_Time_left = auctionsEndTimes.map((ele) =>
          onCountDown(ele.id, ele.endsAt)
        );
        setAuctionsTimeLeft(Auctions_Time_left);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [auctions]);

  const {
    mutate: placeBid,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: () =>
      onPlaceBid(
        {
          bid: currentBid,
          lotId: bidDetails?.id ?? '',
          manual: !useBidAgent,
        },
        session?.accessToken
      ),
    onSuccess(data) {
      setShowBidModal(false);
      if (data.outbid) {
        setOutBid(true);
      } else if (data.success) {
        setSuccessfulBid(true);
      }
      refetch();
    },
    onError() {
      setUnSuccessfulBid(true);
    },
  });

  usePageInfiniteLoader(fetchNextPage, !hasNextPage);

  const onConfirmBid = async () => {
    placeBid();
  };

  if (
    !Object.values(filters).every((element) => element === null) &&
    !auctions.length &&
    !isLoading
  ) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-shade">No auctions match your filters.</p>
      </div>
    );
  }

  const LOADINE_STATE =
    (!auctions.length && !auctionsTimeLeft.length) || isLoading;

  return (
    <>
      {LOADINE_STATE && <div className='flex justify-center items-center'><LoadingComponent /></div>}
      {!LOADINE_STATE && (
        <>
          <p className="mb-4 text-primary">{auctions?.length} results</p>
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_60px] gap-4 px-4 py-4 text-sm text-dark border-b">
            <div />
            <div>Brand & Model</div>
            <div>Year</div>
            <div>Mileage</div>
            <div>Location</div>
            <div>Current Bid</div>
            <div>Time left</div>
          </div>

          <div className="divide-y divide-neutral">
            {auctions?.map((auction, index) => {
              const MINIMUM_BID = !!auction?.bidList?.length
                ? Math.max(...auction?.bidList?.map((ele) => ele.bid)) + 100
                : 100;

              const TIME_LEFT = auctionsTimeLeft.filter(
                (el) => el.id === auction.id
              )?.[0]?.timeLeft;

              return (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_60px] gap-4 items-center px-4 py-4 text-sm hover:bg-neutral-tint"
                >
                  <Image
                    src={`${auction?.images?.[2]}`}
                    alt={`${auction?.title}`}
                    width={100}
                    height={75}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium">
                      {auction?.title?.split(',')[0]}
                    </h3>
                  </div>
                  <div>{auction?.details.firstRegistration.split('/')[1]}</div>
                  <div>{auction?.details?.mileage} KM</div>
                  <div>{auction?.details?.location}</div>
                  <div>CHF {formatNumber(MINIMUM_BID)}</div>
                  <span className="text-primary truncate">{TIME_LEFT}</span>
                  <Button
                    variant="default"
                    className="bg-primary"
                    onClick={() => {
                      setBidDetails(auction);
                      setCurrentBid(MINIMUM_BID);
                      setShowBidModal(true);
                    }}
                  >
                    Place bid
                  </Button>
                  <button
                    onClick={() => onToggleFavorite(auction.id)}
                    className="p-2 hover:bg-neutral rounded-full m-auto"
                  >
                    {auction.isFavorite ? (
                      <StarSolidIcon className="w-5 text-accent" />
                    ) : (
                      <StarOutlineIcon className="w-5 text-neutral-shade" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <BidModal
        {...{
          isOpen: showBidModal,
          onDismiss() {
            setShowBidModal(false);
          },
          onConfirmBid,
          bidDetails,
          setCurrentBid,
          currentBid,
          useBidAgent,
          setUseBidAgent,
          isPending,
          isSuccess,
        }}
      />
      <UnSuccessfulBidModal
        {...{
          isOpen: unSuccessfulBid,
          bid: currentBid,
          onDismiss() {
            setUnSuccessfulBid(false);
          },
          onPlaceBid() {
            setUnSuccessfulBid(false);
            setShowBidModal(true);
          },
        }}
      />
      <SuccessfulBidModal
        {...{
          bid: currentBid,
          isOpen: successfulBid,
          onDismiss() {
            setSuccessfulBid(false);
          },
        }}
      />
      <OutBidModal
        {...{
          isOpen: outBid,
          onDismiss() {
            setOutBid(false);
          },
        }}
      />
    </>
  );
};

export default AuctionList;
