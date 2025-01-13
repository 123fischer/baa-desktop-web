'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, m, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import XIcon from 'public/icons/xIcon.svg';
import { Input } from '../UI/Input';

interface BidModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  details: {
    carName: string;
    carDetails: string;
    imageUrl: string;
    minimumBid: number;
  };
  currentBid: number;
  setCurrentBid: (value: any) => void;
}

const BidModal = ({
  isOpen,
  onDismiss,
  onConfirm,
  details,
  currentBid,
  setCurrentBid,
}: BidModalProps) => {
  const [useBidAgent, setUseBidAgent] = useState(false);
  const [confirmBid, setConfirmBid] = useState(false);

  const bidIncrement = 10;

  if (!isOpen) return null;

  const handleIncrementBid = () => {
    setCurrentBid((prev: any) => prev + bidIncrement);
  };

  const handleDecrementBid = () => {
    if (currentBid - bidIncrement >= details?.minimumBid) {
      setCurrentBid((prev: any) => prev - bidIncrement);
    }
  };

  const handlePlaceBid = () => {
    setConfirmBid(true);
  };

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
            onClick={onDismiss}
            className="absolute right-4 top-4 bg-neutral-100 w-8 h-8 px-0 py-0  hover:bg-neutral-200 rounded-full"
          >
            <XIcon />
          </Button>

          <h2 className="text-2xl font-semibold mb-10 text-dark">
            {confirmBid ? 'Confirm Your Bid' : 'Place Your Bid'}
          </h2>
          <div className="flex gap-5 mb-7">
            <img
              src={details?.imageUrl}
              alt={details?.carName}
              className="w-40 h-31 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-dark">
                {details?.carName}
              </h3>
              <p className="text-light-dark">{details?.carDetails}</p>
            </div>
          </div>

          {!confirmBid && (
            <>
              <div className="mb-6 border-t-[1px] border-t-neutral-200 pt-6">
                <label className="block text-[15px] mb-2 text-dark">
                  Your maximum bid
                </label>
                <div className="flex items-center gap-2 border-[1px] rounded-lg border-neutral-300 p-2">
                  <input
                    type="text"
                    id={details?.carName}
                    value={currentBid ? currentBid.toString() : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentBid(parseInt(value));
                    }}
                    className="flex-1 border-0 rounded-lg px-4 py-2 text-center text-[15px] focus:outline-none "
                  />
                  <button
                    onClick={handleIncrementBid}
                    className="bg-neutral-100 hover:bg-neutral-200 px-5 py-2 text-[15px] rounded-lg font-semibold text-dark"
                  >
                    + CHF {bidIncrement}
                  </button>
                  <button
                    onClick={handleDecrementBid}
                    className="bg-neutral-100 hover:bg-neutral-200 px-5 py-2 text-[15px] rounded-lg font-semibold text-dark"
                  >
                    - CHF {bidIncrement}
                  </button>
                </div>
                <p className="text-light-dark text-[14px] mt-1">
                  Minimum bid CHF {details.minimumBid.toLocaleString()}
                </p>
              </div>

              <div className="bg-neutral-100 border-[1px] border-neutral-200 px-6 py-5 rounded-lg mb-6">
                <p className="text-light-dark text-center text-[16px]">
                  Minimum Bid increment is CHF
                  {bidIncrement.toLocaleString()}. If you bid more than CHF xxx
                  by default the{' '}
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
              >
                Place bid
              </Button>
            </>
          )}
          {confirmBid && (
            <div className="pt-2">
              <div className="flex-col gap-2 bg-neutral-100 border-[1px] border-neutral-200 px-6 py-5 rounded-lg mb-8 flex justify-center text-center font-semibold">
                <span className="text-[18px] text-light-dark">Check bid</span>
                <h1 className="text-[30px] text-dark">CHF {currentBid}</h1>
                <span className="text-dark font-light ">
                  Plus <span className="font-bold">CHF 99 </span> auction fee
                  for a successful purchase.
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
                <Button onClick={onConfirm} className="w-[50%] h-11">
                  Confirm bid
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
