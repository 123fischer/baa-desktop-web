import { Button } from '@/components/UI/Button';
import ArrowIcon from 'public/icons/arrowDown.svg';

interface Props {
  pages: number;
  activePage: number;
}

const ErrorMessage = ({ pages, activePage }: Props) => {
  return (
    <div className="flex items-center justify-end pt-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <ArrowIcon className="w-2 rotate-90" />
          <span className="sr-only">Previous page</span>
        </Button>

        {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === activePage ? 'default' : 'outline'}
            className={page === activePage ? 'bg-primary' : ''}
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
  );
};

export default ErrorMessage;
