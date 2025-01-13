import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import XIcon from 'public/icons/xIcon.svg';

interface BidModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}
const OutBidModal = ({ isOpen, onDismiss }: BidModalProps) => {
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
          <div className="flex flex-1 justify-end">
            <Button
              variant="default"
              onClick={onDismiss}
              className="bg-neutral-tint hover:bg-neutral w-9 h-9 px-0 py-0 rounded-full"
            >
              <XIcon />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-5 justify-between items-center mt-5 px-5">
            <p className="font-semibold text-[20px] text-center">
              Ihr Gebot wurde automatisch von einem Bietagenten überboten
            </p>
            <p className="text-[18px] text-center">
              Sie können ein neues Gebot abgeben, falls Sie das Auto weiterhin
              ersteigern möchten.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OutBidModal;
