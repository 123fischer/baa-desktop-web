'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import useAuctions from '@/hooks/useAuctions';
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

import { Auction, BidList } from '@/types/types';
import { onCountDown } from '@/utils/utlis';
import { useRunningAuctionsListener } from '@/listeners/useRunningAuctionsListener';
import useBid from '@/hooks/useBid';
import useAuction from '@/hooks/useCarAuction';
import { USERNAME } from '@/constants/constants';

const Auctions = () => {
  const { data: session } = useSession();
  const { hasSelectedFilter } = useFilters();
  const [useBidAgent, setUseBidAgent] = useState(true);
  const [bidDetails, setBidDetails] = useState<Auction | null>(null);
  const [bidUpdated, setBidUpdated] = useState(false);
  const [currentBid, setCurrentBid] = useState(100);
  const [auctionsTimeLeft, setAuctionsTimeLeft] = useState<
    | {
        id: string;
        timeLeft: string;
      }[]
    | null
  >([]);
  const { getAuction } = useAuction();
  const {
    auctions,
    hasNextPage,
    onToggleFavorite,
    fetchNextPage,
    refetch,
    setAuctions,
    isLoading,
    isFetching,
  } = useAuctions();

  const {
    placeBid,
    unSuccessfulBid,
    successfulBid,
    outBid,
    showBidModal,
    setSuccessfulBid,
    setUnSuccessfulBid,
    setOutBid,
    setShowBidModal,
    isPending,
    isSuccess,
  } = useBid();

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
        if (Auctions_Time_left.some((ele) => !ele.timeLeft)) {
          setAuctionsTimeLeft(
            Auctions_Time_left.filter((ele) => !!ele.timeLeft)
          );
          refetch();
        } else {
          setAuctionsTimeLeft(Auctions_Time_left);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [auctions]);

  useEffect(() => {
    if (bidUpdated && auctions.length) {
      setBidDetails(
        auctions.find((item) => item.id === bidDetails?.id) ?? null
      );
    }
  }, [auctions, bidUpdated]);

  const onConfirmBid = () => {
    placeBid({
      currentBid,
      id: bidDetails?.id ?? '',
      manual: !useBidAgent,
    });
  };

  // Subscribe to auctions real-time update
  const updateAuctions = async (docIDs?: string[]) => {
    const auctionsUpdated = await Promise.all(
      docIDs?.map(async (id) => {
        const auction = await getAuction(id);
        return auction;
      }) || []
    );

    const newAuctions = auctionsUpdated.filter(
      (updatedAuction) =>
        !auctions.some((auction) => auction.id === updatedAuction.id)
    );

    auctionsUpdated?.map((updated) => {
      const updatedIndex = auctions.findIndex(
        (auction) => updated.id === auction.id
      );
      if (updatedIndex > -1) {
        auctions[updatedIndex] = updated;
      }
    });

    setAuctions([...newAuctions, ...auctions]);

    if (auctionsUpdated.some((auction) => auction.id === bidDetails?.id)) {
      const bidList = auctionsUpdated
        .filter((auction) => auction.id === bidDetails?.id)
        .map((lot) => lot.bidList as BidList[]);

      const maxBid: any = bidList.filter(
        (ele: any) =>
          ele.bid === Math.max(...bidList?.map((ele: any) => ele.bid))
      );
      if (maxBid?.username !== USERNAME) {
        setBidUpdated(true);
        setBidDetails(
          auctions.find((item) => item.id === bidDetails?.id) ?? null
        );
      }
    }
  };

  useRunningAuctionsListener(updateAuctions);

  usePageInfiniteLoader(fetchNextPage, !hasNextPage);

  const LOADINE_STATE =
    !session?.accessToken || isLoading || (!auctions.length && isFetching);

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
            {auctions.map((auction, index) => {
              const TIME_LEFT = auctionsTimeLeft?.filter(
                (el) => el.id === auction.id
              )?.[0]?.timeLeft;
              return (
                <Row
                  key={index}
                  auction={auction}
                  buttons={[
                    {
                      name: 'Place bid',
                      onClick: () => {
                        setBidDetails(auction);
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
          useBidAgent,
          setUseBidAgent,
          bidUpdated,
          setBidUpdated,
          currentBid,
          setCurrentBid,
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

export default Auctions;
