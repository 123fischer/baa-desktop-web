import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import XIcon from 'public/icons/xIcon.svg';
import ErrorIcon from '../UI/Error';
import { formatNumber } from '@/utils/utlis';

interface BidModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  bid: number;
  onPlaceBid?: () => void;
}
const UnSuccessfulBidModal = ({
  isOpen,
  onDismiss,
  onPlaceBid,
  bid,
}: BidModalProps) => {
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
          <div>
            <h2 className="text-2xl font-semibold mb-10 text-dark">
              {'Unsuccessful Bidding'}
            </h2>
            <Button
              variant="default"
              onClick={onDismiss}
              className="absolute right-4 top-6 bg-neutral-tint hover:bg-neutral w-9 h-9 px-0 py-0 rounded-full"
            >
              <XIcon />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-5 justify-between items-center">
            <ErrorIcon />
            <div className="flex flex-col gap-2 items-center">
              <span className="font-semibold text-light-dark text-[17px]">
                Bid Error!
              </span>
              <span className="font-bold text-dark text-[26px]">
                CHF {formatNumber(bid)}
              </span>
            </div>
            <p className="font-semibold text-dark text-[22px] text-center">
              You have been outbid by a bid agent. Please place a higher bid.
            </p>
            <div className="flex gap-5 w-full">
              <Button
                onClick={onDismiss}
                className="w-[50%] h-11 border-primary text-primary"
                variant={'outline'}
              >
                Cancel bidding
              </Button>
              <Button onClick={onPlaceBid} className="w-[50%] h-11">
                Place a higher bid
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnSuccessfulBidModal;
