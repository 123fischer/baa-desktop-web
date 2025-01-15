import { JSX } from 'react';
import Auctions from 'src/components/pages/Auctions';
import StompClientProvider from '@/contexts/StompClientProvider';

const AuctionsPage: () => JSX.Element = () => {
  return (
    <StompClientProvider>
      <Auctions />
    </StompClientProvider>
  );
};

export default AuctionsPage;
