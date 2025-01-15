'use client';

import CloseIcon from 'public/icons/close.svg';
import SearchIcon from 'public/icons/search.svg';
import { Button } from '@/components/UI/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/Select';
import { Input } from '@/components/UI/Input';
import { useFilters } from '@/contexts/FilterContext';
import { getUniqueValues } from '@/utils/filters';
import { makes } from '@/constants/makes';
import { parseMileage, formatMileage } from '@/utils/mileage';
import { cn } from '@/utils/utlis';

interface Props {
  auctionsLength: number;
}

const SearchFilters = ({ auctionsLength }: Props) => {
  const { filters, updateFilter, resetFilters } = useFilters();
  const years = getUniqueValues('year');
  const locations = getUniqueValues('location');

  const mileages = getUniqueValues('mileage')
    .map((m) => parseMileage(m))
    .sort((a, b) => a - b);

  const hasSelectedFilter = Object.values(filters).some((value) =>
    value?.trim()
  );

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[240px_1fr_1fr_1fr_1fr_1fr] gap-4 mb-4',
          hasSelectedFilter && 'grid-cols-[240px_1fr_1fr_1fr_1fr_1fr_87px]'
        )}
      >
        <Input
          placeholder="Search by brand or model"
          icon={<SearchIcon className="w-[20px] opacity-50" />}
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <Select
          value={filters.make}
          onValueChange={(value) => updateFilter('make', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make.value} value={make.value}>
                {make.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.year}
          onValueChange={(value) => updateFilter('year', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Build year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.mileage}
          onValueChange={(value) => updateFilter('mileage', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Mileage" />
          </SelectTrigger>
          <SelectContent>
            {mileages.map((mileage) => (
              <SelectItem key={mileage} value={String(mileage)}>
                Under {formatMileage(mileage)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.location}
          onValueChange={(value) => updateFilter('location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="year-desc">Year: Newest First</SelectItem>
            <SelectItem value="year-asc">Year: Oldest First</SelectItem>
          </SelectContent>
        </Select>
        {hasSelectedFilter && (
          <Button
            className="flex items-center gap-2 font-normal bg-secondary text-black"
            onClick={resetFilters}
          >
            Reset
            <CloseIcon className="w-5 shrink-0" />
          </Button>
        )}
      </div>
      {hasSelectedFilter && (
        <p className="mb-4 text-primary">{auctionsLength} results</p>
      )}
    </>
  );
};

export default SearchFilters;
