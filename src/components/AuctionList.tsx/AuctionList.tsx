'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { getRunningAuctions, onPlaceBid } from '@/api/api';

import ArrowIcon from 'public/icons/arrowDown.svg';
import StarOutlineIcon from 'public/icons/starOutline.svg';
import StarSolidIcon from 'public/icons/starSolid.svg';

import useCarAuction from '@/hooks/useCarAuction';
import { capitalizeFirstLetter } from '@/utils/utlis';
import { Button } from '@/components/UI/Button';
import BidModal from '../Modals/BidModal';
import UnSuccessfulBidModal from '../Modals/UnSuccessfulBidModal';
import SuccessfulBidModal from '../Modals/SuccessfulBidModal';
import { Auction } from '@/types/types';
import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { Category, SortState } from '@/enums';

const AuctionList = () => {
  const { auctions, toggleFavorite } = useCarAuction();
  const { data: session, status: sessionStatus } = useSession();
  const [showBidModal, setShowBidModal] = useState(false);
  const [successfulBid, setSuccessfulBid] = useState(false);
  const [unSuccessfulBid, setUnSuccessfulBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(false);
  const [currentBid, setCurrentBid] = useState(100);
  const [bidDetaits, setBidDetails] = useState<any>();

  if (auctions?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-300">No auctions match your filters.</p>
      </div>
    );
  }
  const onCountDown = (time: Date) => {
    const now = dayjs();
    const TIME_LEFT = dayjs(time).diff(now, 'D');
    return dayjs(TIME_LEFT).format('d-hh-mm-ss');
  };

  const onConfirmBid = async () => {
    setShowBidModal(false);
    try {
      const res = onPlaceBid(
        {
          bid: currentBid,
          lotId: bidDetaits.id,
        },
        session?.accessToken
      );
    } catch (error) {}
  };

  return (
    <>
      <p className="mb-4 text-primary">{auctions?.length} results</p>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_60px] gap-4 px-4 py-4 text-sm text-dark border-b">
        <div />
        <div>Brand & Model</div>
        <div>Year</div>
        <div>Mileage</div>
        <div>Location</div>
        <div>Current Bid</div>
        <div>Time left</div>
      </div>

      <div className="divide-y divide-neutral-200">
        {auctions.map((auction) => {
          const MINIMUM_BID = !!auction?.bidList.length
            ? Math.max(...auction?.bidList?.map((ele) => ele.bid)) + 100
            : 100;

          return (
            <div
              key={auction.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_60px] gap-4 items-center px-4 py-4 text-sm hover:bg-neutral-100"
            >
              <Image
                src={`${auction.images[2]}`}
                alt={`${auction.brand}`}
                width={100}
                height={75}
                className="rounded-lg"
              />
              <div>
                {/* <h3 className="font-medium">
                  {capitalizeFirstLetter(auction.brand)}
                </h3> */}
              </div>
              <div>{/*<h3>{auction?.year}</h3>*/}</div>
              <div>{auction?.details?.mileage} miles</div>
              <div>{auction.details.location}</div>
              <div>${MINIMUM_BID}</div>
              <span className="text-primary truncate">
                {onCountDown(auction.endsAt)}
              </span>
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
                onClick={() => toggleFavorite(auction.id)}
                className="p-2 hover:bg-neutral-200 rounded-full m-auto"
              >
                {auction.isFavorite ? (
                  <StarSolidIcon className="w-5 text-accent" />
                ) : (
                  <StarOutlineIcon className="w-5 text-neutral-300" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowIcon className="w-2 rotate-90" />
            <span className="sr-only">Previous page</span>
          </Button>

          {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? 'default' : 'outline'}
              className={page === 1 ? 'bg-primary' : ''}
              size="sm"
            >
              {page}
            </Button>
          ))}

          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowIcon className="w-2 -rotate-90" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
      <BidModal
        {...{
          isOpen: showBidModal,
          onDismiss() {
            setShowBidModal(false);
          },
          onConfirm: onConfirmBid,
          details: {
            carName: bidDetaits?.title,
            carDetails: `${bidDetaits?.details?.mileage} km, ${bidDetaits?.details?.firstRegistration}`,
            imageUrl: bidDetaits?.images[0],
            minimumBid: !!bidDetaits?.bidList.length
              ? Math.max(...bidDetaits?.bidList?.map((ele: any) => ele.bid)) +
                100
              : 100,
          },
          setCurrentBid: (value: any) => setCurrentBid(value),
          currentBid: currentBid,
          bidIncrement: 10,
        }}
      />
      <UnSuccessfulBidModal
        {...{
          isOpen: unSuccessfulBid,
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
          isOpen: successfulBid,
          onDismiss() {
            setSuccessfulBid(false);
          },
        }}
      />
    </>
  );
};

export default AuctionList;
