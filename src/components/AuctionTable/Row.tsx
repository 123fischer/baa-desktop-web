import Image from 'next/image';
import { capitalizeFirstLetter, cn } from '@/utils/utlis';
import { Button } from '@/components/UI/Button';
import StarSolidIcon from 'public/icons/starSolid.svg';
import StarOutlineIcon from 'public/icons/starOutline.svg';
import { Auction } from '@/types/types';

interface Props {
  auction: Auction;
  onFavouriteClick: (id: string) => void;
  buttons?: { name: string; onClick: () => void }[];
}

const Row = ({ auction, onFavouriteClick, buttons }: Props) => {
  return (
    <tr className="text-center border-b hover:bg-gray-50">
      <td className="py-2 px-2">
        <Image
          src={auction.image}
          alt={`${auction.brand} ${auction.model}`}
          width={100}
          height={75}
          className="rounded-lg"
        />
      </td>
      <td className="text-left py-2 px-2 text-sm">
        <h3>
          {capitalizeFirstLetter(auction.brand)}{' '}
          {capitalizeFirstLetter(auction.model)}
        </h3>
      </td>
      <td className="text-left py-2 px-2 text-sm">{auction.year}</td>
      <td className="text-left py-2 px-2 text-sm">{auction.mileage}</td>
      <td className="text-left py-2 px-2 text-sm">{auction.location}</td>
      <td className="text-left py-2 px-2 text-sm">
        ${auction.currentBid.toLocaleString()}
      </td>
      <td className="text-primary truncate text-left py-2 px-2 text-sm">
        2d 3h 45m 30s
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
