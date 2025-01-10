'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

import useCarAuction from '@/hooks/useCarAuction';
import { capitalizeFirstLetter } from '@/utils/utlis';

import { Button } from '../Button';
import { getRunningAuctions } from '@/api/api';
import { useSession } from 'next-auth/react';

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
        <p className="text-gray-500">No auctions match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[100px_200px_100px_150px_120px_150px_auto] gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
        <div>Image</div>
        <div>Make & Model</div>
        <div>Year</div>
        <div>Mileage</div>
        <div>Location</div>
        <div>Current Bid</div>
        <div className="text-right pr-14">Actions</div>
      </div>

      <div className="divide-y divide-gray-100">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="grid grid-cols-[100px_200px_100px_150px_120px_150px_auto] gap-4 items-center px-4 py-4 hover:bg-gray-50"
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
            <div className="flex items-center justify-end gap-4">
              <span className="text-red-600">{auction.timeLeft}</span>
              <Button variant="default" className="bg-red-600 hover:bg-red-700">
                Place bid
              </Button>
              <button
                onClick={() => toggleFavorite(auction.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Star
                  className={`h-5 w-5 ${
                    auction.isFavorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-500">
          Showing {auctions.length}{' '}
          {auctions.length === 1 ? 'result' : 'results'}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? 'default' : 'outline'}
              className={page === 1 ? 'bg-red-600 hover:bg-red-700' : ''}
              size="sm"
            >
              {page}
            </Button>
          ))}

          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
