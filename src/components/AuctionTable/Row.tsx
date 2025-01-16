import Image from 'next/image';
import { cn, formatNumber } from '@/utils/utlis';
import { Button } from '@/components/UI/Button';
import StarSolidIcon from 'public/icons/starSolid.svg';
import StarOutlineIcon from 'public/icons/starOutline.svg';
import { Auction } from '@/types/types';

interface Props {
  auction: Auction;
  onFavouriteClick: (id: string) => void;
  buttons?: { name: string; onClick: (auction: Auction) => void }[];
  timeLeft?: string;
}

const Row = ({
  auction,
  onFavouriteClick,
  buttons = [],
  timeLeft = '',
}: Props) => {
  const MINIMUM_BID = !!auction?.bidList?.length
    ? Math.max(...auction?.bidList?.map((ele) => ele.bid)) + 100
    : 100;
  return (
    <tr className="text-center border-b hover:bg-gray-50">
      <td className="py-2 px-2">
        <Image
          src={auction?.images?.[0]}
          alt={`${auction?.title}`}
          width={100}
          height={75}
          className="rounded-lg"
        />
      </td>
      <td className="text-left py-2 px-2 text-sm">
        <h3>{auction?.title?.split(',')[0]}</h3>
      </td>
      <td className="text-left py-2 px-2 text-sm">
        {auction?.details.firstRegistration.split('/')[1]}
      </td>
      <td className="text-left py-2 px-2 text-sm">
        {formatNumber(auction?.details?.mileage)}
      </td>
      <td className="text-left py-2 px-2 text-sm">
        {auction?.details?.location}
      </td>
      <td className="text-left py-2 px-2 text-sm">
        CHF {formatNumber(MINIMUM_BID)}
      </td>
      <td className="text-primary truncate text-left py-2 px-2 text-sm">
        {timeLeft}
      </td>
      {buttons?.length > 0 && (
        <td className="text-left py-2 px-2 text-sm">
          <div className="flex items-center gap-2">
            {buttons?.map((button, key) => (
              <Button
                key={button.name}
                variant="default"
                className={cn(
                  'bg-primary',
                  buttons?.length > 1 &&
                    key === 0 &&
                    'bg-transparent border border-primary text-primary'
                )}
                onClick={() => button.onClick(auction)}
              >
                {button.name}
              </Button>
            ))}
          </div>
        </td>
      )}
      <td className="text-center py-2 px-2 text-sm">
        <button
          onClick={() => onFavouriteClick(auction.id)}
          className="p-2 hover:bg-neutral rounded-full m-auto"
        >
          {auction.isFavorite ? (
            <StarSolidIcon className="w-5 text-accent" />
          ) : (
            <StarOutlineIcon className="w-5 text-neutral-shade" />
          )}
        </button>
      </td>
    </tr>
  );
};

export default Row;
