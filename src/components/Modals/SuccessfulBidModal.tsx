import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import XIcon from 'public/icons/xIcon.svg';
import CheckIcon from '../UI/Check';
import { formatNumber } from '@/utils/utlis';

interface BidModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  bid: number;
}
const SuccessfulBidModal = ({ isOpen, onDismiss, bid }: BidModalProps) => {
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
              {'Successful Bidding'}
            </h2>
            <Button
              variant="default"
              onClick={onDismiss}
              className="absolute right-4 top-6 bg-neutral-100 hover:bg-neutral-200 w-9 h-9 px-0 py-0 rounded-full"
            >
              <XIcon />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-5 justify-between items-center">
            <CheckIcon />
            <div className="flex flex-col gap-2 items-center">
              <span className="font-semibold text-light-dark text-[17px]">
                Bid Success!
              </span>
              <span className="font-bold text-dark text-[26px]">
                CHF {formatNumber(bid)}
              </span>
            </div>
            <p className="font-semibold text-dark text-[18px]">
              Your bid has been successfully placed!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessfulBidModal;
