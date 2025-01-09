'use client';

import { X } from 'lucide-react';
import { Button } from './Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';
import { Input } from './Input';
import { useFilters } from '@/contexts/FilterContext';
import { getUniqueValues } from '@/utils/filters';
import { makes } from '@/constants/makes';
import { parseMileage, formatMileage } from '@/utils/mileage';

const SearchFilters = () => {
  const { filters, updateFilter, resetFilters } = useFilters();
  const years = getUniqueValues('year');
  const locations = getUniqueValues('location');
  
  // Get unique mileages from actual cars
  const mileages = getUniqueValues('mileage')
    .map((m) => parseMileage(m))
    .sort((a, b) => a - b);

  return (
    <div className="flex gap-4 mb-8">
      <Input
        placeholder="Search by brand or model"
        className="max-w-[240px]"
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
      />
      <Select
        value={filters.make}
        onValueChange={(value) => updateFilter('make', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Make" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Makes</SelectItem>
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Build year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mileage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Mileages</SelectItem>
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">No sorting</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="year-desc">Year: Newest First</SelectItem>
          <SelectItem value="year-asc">Year: Oldest First</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={resetFilters}
      >
        <X className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default SearchFilters;
