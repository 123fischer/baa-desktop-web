'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { getRunningAuctions } from '@/api/api';

import ArrowIcon from 'public/icons/arrowDown.svg';
import StarOutlineIcon from 'public/icons/starOutline.svg';
import StarSolidIcon from 'public/icons/starSolid.svg';

import useCarAuction from '@/hooks/useCarAuction';
import { capitalizeFirstLetter } from '@/utils/utlis';
import { Button } from '@/components/UI/Button';

const AuctionList = () => {
  const { auctions, toggleFavorite } = useCarAuction();
  const { data: session, status: sessionStatus } = useSession();
  const isLoggedIn = !!session?.accessToken;

  const getAuctions = async () => {
    if (isLoggedIn) {
      await getRunningAuctions(session.accessToken);
    }
  };

  useEffect(() => {
    getAuctions();
  }, [session]);

  if (auctions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-300">No auctions match your filters.</p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-primary">{auctions.length} results</p>
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
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_60px] gap-4 items-center px-4 py-4 text-sm hover:bg-neutral-100"
          >
            <Image
              src={auction.image}
              alt={`${auction.brand} ${auction.model}`}
              width={100}
              height={75}
              className="rounded-lg"
            />
            <div>
              <h3 className="font-medium">
                {capitalizeFirstLetter(auction.brand)}{' '}
                {capitalizeFirstLetter(auction.model)}
              </h3>
            </div>
            <div>{auction.year}</div>
            <div>{auction.mileage}</div>
            <div>{auction.location}</div>
            <div>${auction.currentBid.toLocaleString()}</div>
            <span className="text-primary truncate">{auction.timeLeft}</span>
            <Button variant="default" className="bg-primary">
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
        ))}
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
    </>
  );
};

export default AuctionList;
