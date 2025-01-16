'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import LoadingComponent from '../UI/Loading';
import { BID_INCREMENT } from '@/constants/constants';
import { formatNumber } from '@/utils/utlis';
import XIcon from 'public/icons/xIcon.svg';
import { Auction } from '@/types/types';

interface BidModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirmBid: () => void;
  bidDetails: Auction | null;
  currentBid: number;
  setCurrentBid: (value: any) => void;
  useBidAgent: boolean;
  setUseBidAgent: (value: boolean) => void;
  isPending: boolean;
  isSuccess: boolean;
  bidUpdated?: boolean;
  setBidUpdated: (value: boolean) => void;
}

const BidModal = ({
  isOpen,
  onDismiss,
  onConfirmBid,
  bidDetails,
  currentBid,
  setCurrentBid,
  useBidAgent,
  setUseBidAgent,
  isPending,
  isSuccess,
  bidUpdated,
  setBidUpdated,
}: BidModalProps) => {
  const [confirmBid, setConfirmBid] = useState(false);
  const [minimumBid, setMinimumBid] = useState<number>(100);
  const [warning, setWarning] = useState(false);

  const handleIncrementBid = () => {
    setCurrentBid((prev: any) => prev + BID_INCREMENT);
  };

  const handleDecrementBid = () => {
    if (currentBid - BID_INCREMENT >= minimumBid) {
      setCurrentBid((prev: any) => prev - BID_INCREMENT);
    }
  };

  const handleOnDismiss = () => {
    setConfirmBid(false);
    setCurrentBid(minimumBid);
    setBidUpdated(false);
    onDismiss?.();
  };

  const handlePlaceBid = () => {
    setConfirmBid(true);
  };
  const handleConfirmBid = () => {
    onConfirmBid?.();
  };

  const formatTextInput = (value: string) => {
    const prevValue = currentBid ? (currentBid / 100).toString() : '';
    const lastDigit = value.slice(-1);
    if (value.length < currentBid.toString().length) {
      if (parseInt(value) % 100 === 0) {
        setCurrentBid(parseInt(value));
      } else {
        setCurrentBid(
          parseInt(
            value.length === 1 ? value : value.substring(0, value.length - 2)
          ) * 100
        );
      }
    } else {
      setCurrentBid(parseInt(prevValue.concat(lastDigit)) * 100);
    }
  };

  useEffect(() => {
    if (bidDetails) {
      const MINIMUM_BID = !!bidDetails?.bidList?.length
        ? Math.max(...bidDetails?.bidList?.map((ele: any) => ele.bid)) + 100
        : 100;
      setMinimumBid(MINIMUM_BID);
      if (!bidUpdated) {
        setCurrentBid(MINIMUM_BID);
      }
    }
  }, [bidDetails]);

  useEffect(() => {
    if (bidUpdated && currentBid === minimumBid) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [bidUpdated]);

  useEffect(() => {
    if (currentBid >= minimumBid && warning) {
      setWarning(false);
    }
  }, [currentBid]);

  useEffect(() => {
    if (isSuccess) {
      setConfirmBid(false);
    }
  }, [isSuccess]);

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
        }}
        transition={{ ease: 'easeInOut', duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg max-w-xl w-full p-8 relative">
          <Button
            variant="default"
            onClick={handleOnDismiss}
            className="absolute right-4 top-4 bg-neutral-tint w-8 h-8 px-0 py-0  hover:bg-neutral rounded-full"
          >
            <XIcon />
          </Button>

          <h2 className="text-2xl font-semibold mb-10 text-dark">
            {confirmBid ? 'Confirm Your Bid' : 'Place Your Bid'}
          </h2>
          <div className="flex gap-5 mb-7">
            <img
              src={bidDetails?.images?.[0]}
              alt={bidDetails?.title}
              className="w-40 h-31 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-dark">
                {bidDetails?.title}
              </h3>
              <p className="text-light-dark">{`${bidDetails?.details?.mileage} km, ${bidDetails?.details?.firstRegistration}`}</p>
            </div>
          </div>

          {!confirmBid && (
            <>
              <div className="mb-6 border-t-[1px] border-t-neutral pt-6">
                <label className="block text-[15px] mb-2 text-dark">
                  Your maximum bid
                </label>
                <div
                  className={`flex items-center gap-2 border-[1px] rounded-lg ${
                    warning ? 'border-error' : 'border-neutral-shade'
                  } px-4 py-2`}
                >
                  <span className="text-light-dark">CHF</span>
                  <input
                    type="text"
                    id={bidDetails?.title}
                    value={currentBid ? formatNumber(currentBid) : ''}
                    onChange={(e) => {
                      const unformattedValue = e.target.value.replace(/'/g, '');
                      formatTextInput(unformattedValue);
                    }}
                    className="border-1 flex-1 rounded-lg py-2 text-left text-[15px] focus:outline-none "
                  />
                  <button
                    onClick={handleIncrementBid}
                    className="bg-neutral-tint hover:bg-neutral px-5 py-2 text-[15px] rounded-lg font-semibold text-dark"
                  >
                    + CHF {BID_INCREMENT}
                  </button>
                  <button
                    onClick={handleDecrementBid}
                    className="bg-neutral-tint hover:bg-neutral px-5 py-2 text-[15px] rounded-lg font-semibold text-dark"
                  >
                    - CHF {BID_INCREMENT}
                  </button>
                </div>
                {warning && (
                  <span className="text-error text-[14px]">{`Another user has placed a bid of CHF ${currentBid}. Please bid at least CHF ${minimumBid}.`}</span>
                )}

                <p className="text-light-dark text-[14px] mt-1">
                  Minimum bid CHF {formatNumber(minimumBid)}
                </p>
              </div>

              <div className="bg-neutral-tint border-[1px] border-neutral px-6 py-5 rounded-lg mb-6">
                <p className="text-light-dark text-center text-[16px]">
                  Minimum Bid increment is CHF {BID_INCREMENT.toLocaleString()}.
                  If you bid more than CHF {formatNumber(minimumBid)} by default
                  the{' '}
                  <a className="underline" href="">
                    Bid Agent{' '}
                  </a>{' '}
                  will bid for you.
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useBidAgent}
                    onChange={(e) => setUseBidAgent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-light-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className="text-light-dark font-semibold">
                  Bid with{' '}
                  <a className="underline" href="">
                    Bid Agent
                  </a>
                </span>
              </div>

              <Button
                onClick={handlePlaceBid}
                variant={'default'}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-[15px]"
                disabled={Number.isNaN(currentBid) || currentBid < minimumBid}
              >
                Place bid
              </Button>
            </>
          )}
          {confirmBid && (
            <div className="pt-2">
              <div className="flex-col gap-2 bg-neutral-tint border-[1px] border-neutral px-6 py-5 rounded-lg mb-8 flex justify-center text-center font-semibold">
                <span className="text-[18px] text-light-dark">Check bid</span>
                <h1 className="text-[30px] text-dark">
                  CHF {formatNumber(currentBid)}
                </h1>
                <span className="text-dark font-light ">
                  Plus{' '}
                  <span className="font-bold">
                    CHF{' '}
                    {formatNumber(
                      Math.max(99, Math.trunc(0.0099 * currentBid))
                    )}{' '}
                  </span>{' '}
                  auction fee for a successful purchase.
                </span>
              </div>
              <div className="flex gap-5">
                <Button
                  onClick={() => {
                    setConfirmBid(false);
                  }}
                  className="w-[50%] h-11"
                  variant={'secondary'}
                >
                  Edit bid
                </Button>
                <Button
                  onClick={handleConfirmBid}
                  disabled={isPending}
                  className="w-[50%] h-11 justify-center items-center disabled:opacity-100 "
                >
                  {!isPending ? (
                    'Confirm bid'
                  ) : (
                    <LoadingComponent {...{ color: 'text-white' }} />
                  )}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center mt-4 text-[15px] text-dark">
            By placing a bid, you agree to the{' '}
            <a href="#" className="underline">
              Terms and Conditions
            </a>
            .
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BidModal;
