'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';

import useCarAuction from '@/hooks/useCarAuction';
import { useFilters } from '@/contexts/FilterContext';
import { usePageInfiniteLoader } from '@/hooks/hooks';

import Row from '@/components/AuctionTable/Row';
import Header from '@/components/AuctionTable/Header';
import NoResults from '@/components/AuctionTable/NoResults';
import SearchFilters from '@/components/Filters/SearchFilters';
import LoadingComponent from '@/components/UI/Loading';
import BidModal from '@/components/Modals/BidModal';
import UnSuccessfulBidModal from '@/components/Modals/UnSuccessfulBidModal';
import SuccessfulBidModal from '@/components/Modals/SuccessfulBidModal';
import OutBidModal from '@/components/Modals/OutBidModal';

import { Auction } from '@/types/types';
import { onPlaceBid } from '@/api/api';
import { onCountDown } from '@/utils/utlis';
import { useRunningAuctionsListener } from '@/listeners/useRunningAuctionsListener';
import { useAuctionListener } from '@/listeners/useAuctionListener';

const Auctions = () => {
  const { data: session } = useSession();
  const { hasSelectedFilter } = useFilters();
  const {
    auctions,
    onToggleFavorite,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isFetching,
  } = useCarAuction();
  const [showBidModal, setShowBidModal] = useState(false);
  const [successfulBid, setSuccessfulBid] = useState(false);
  const [unSuccessfulBid, setUnSuccessfulBid] = useState(false);
  const [outBid, setOutBid] = useState(false);
  const [currentBid, setCurrentBid] = useState(100);
  const [useBidAgent, setUseBidAgent] = useState(false);
  const [bidDetails, setBidDetails] = useState<Auction | null>(null);
  const [bidUpdated, setBidUpdated] = useState(false);
  const [auctionsTimeLeft, setAuctionsTimeLeft] = useState<
    | {
        id: string;
        timeLeft: string;
      }[]
    | null
  >([]);

  useEffect(() => {
    if (auctions) {
      const intervalId = setInterval(() => {
        const auctionsEndTimes = auctions?.map((auction) => ({
          id: auction.id,
          endsAt: auction.endsAt,
        }));
        const Auctions_Time_left = auctionsEndTimes.map(
          (ele) => ele && onCountDown(ele.id, ele.endsAt)
        );
        if (Auctions_Time_left.some((ele) => !!ele.timeLeft)) {
          refetch();
          setAuctionsTimeLeft(
            Auctions_Time_left.filter((ele) => !!ele.timeLeft)
          );
        } else {
          setAuctionsTimeLeft(Auctions_Time_left);
        }
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

  useEffect(() => {
    if (bidUpdated && auctions.length) {
      setBidDetails(
        auctions.find((item) => item.id === bidDetails?.id) ?? null
      );
    }
  }, [auctions, bidUpdated]);

  const onConfirmBid = () => {
    placeBid();
  };

  // Subscribe to auctions real-time updates
  const updateAuctions = () => {
    refetch();
  };
  useRunningAuctionsListener(updateAuctions);

  // Subscribe to auctions real-time update
  const updateBidAuction = () => {
    setBidUpdated(true);
  };

  useAuctionListener(bidDetails?.id, updateBidAuction);

  usePageInfiniteLoader(fetchNextPage, !hasNextPage);

  const LOADINE_STATE = isLoading || (!auctions.length && isFetching);

  const EMPTY_FILTERED_LIST = hasSelectedFilter && !auctions.length;

  return (
    <>
      <h1 className="text-2xl font-medium mb-6">Auctions</h1>
      <SearchFilters auctionsLength={auctions.length} />

      {LOADINE_STATE && (
        <div className="flex justify-center mt-8">
          <LoadingComponent />
        </div>
      )}

      {!LOADINE_STATE && (
        <table className="table-auto w-full">
          {auctions.length ? <Header /> : <tbody />}
          <tbody>
            {auctions.map((auction) => {
              const TIME_LEFT = auctionsTimeLeft?.filter(
                (el) => el.id === auction.id
              )?.[0]?.timeLeft;
              return (
                <Row
                  key={auction.id}
                  auction={auction}
                  buttons={[
                    {
                      name: 'Place bid',
                      onClick: (auctionBid: Auction) => {
                        setBidDetails(auctionBid);
                        setShowBidModal(true);
                      },
                    },
                  ]}
                  timeLeft={TIME_LEFT}
                  onFavouriteClick={onToggleFavorite}
                />
              );
            })}
          </tbody>
        </table>
      )}

      {EMPTY_FILTERED_LIST && <NoResults />}

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
          bidUpdated,
          setBidUpdated,
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

export default Auctions;
