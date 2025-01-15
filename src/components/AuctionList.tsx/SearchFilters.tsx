'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import CloseIcon from 'public/icons/close.svg';
import { Button } from '@/components/UI/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/Select';
import { useFilters } from '@/contexts/FilterContext';
import { cn } from '@/utils/utlis';
import { FilterOptions } from '@/types/filters';
import { getRunningAuctions } from '@/api/api';
import {
  DEFAULT_MILEAGES_OPTIONS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_YEARS_OPTIONS,
} from '@/constants/constants';
import { Category, SortState } from '@/enums';
import { formatFilters } from '@/hooks/useCarAuction';

const INITIAL_FILTER_OPTIONS = {
  brands: [],
  years: [],
  mileages: [],
  locations: [],
};

const formatFilterOptions = (_options: string[] | number[], key?: string) =>
  _options
    ?.filter((el) => {
      return el !== null;
    })
    ?.map((el) => {
      return {
        label: typeof el === 'number' ? el.toString() : el,
        value: el,
      };
    });

const SearchFilters = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    updateSelection,
    selectionOptions,
    setSorting,
    sorting,
  } = useFilters();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.accessToken;

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(
    INITIAL_FILTER_OPTIONS
  );

  const onSetFilterOptions = async () => {
    const data = await getRunningAuctions(
      {
        size: DEFAULT_PAGE_SIZE,
        category: Category.Running,
        filters: formatFilters(filters),
        order: SortState.Desc,
        cursor: 0,
      },
      session?.accessToken
    );

    const years = DEFAULT_YEARS_OPTIONS;

    const mileages = DEFAULT_MILEAGES_OPTIONS;

    if (data.filters) {
      const { brands, locations } = data.filters;
      setFilterOptions({
        brands: formatFilterOptions(brands, 'brand'),
        years: formatFilterOptions(years, 'year'),
        mileages: formatFilterOptions(mileages, 'mileage'),
        locations: formatFilterOptions(locations, 'location'),
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      onSetFilterOptions();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectionOptions?.yearFrom) {
      updateFilter('firstRegistration', [
        selectionOptions?.yearFrom,
        selectionOptions?.yearTo ?? DEFAULT_YEARS_OPTIONS.pop(),
      ]);
    } else if (selectionOptions?.yearTo) {
      updateFilter('firstRegistration', [
        selectionOptions?.yearFrom ?? DEFAULT_YEARS_OPTIONS[0],
        selectionOptions?.yearTo,
      ]);
    } else {
      updateFilter('firstRegistration', null);
    }
  }, [selectionOptions?.yearFrom, selectionOptions?.yearTo]);

  const updateMileageFilter = () => {
    if (selectionOptions?.mileageFrom) {
      updateFilter('mileage', [
        selectionOptions?.mileageFrom,
        selectionOptions?.mileageTo ?? DEFAULT_MILEAGES_OPTIONS.pop(),
      ]);
    } else if (selectionOptions?.mileageTo) {
      updateFilter('mileage', [
        selectionOptions?.mileageFrom ?? DEFAULT_MILEAGES_OPTIONS[0],
        selectionOptions?.mileageTo,
      ]);
    } else {
      updateFilter('mileage', null);
    }
  };

  useEffect(() => {
    updateMileageFilter();
  }, [selectionOptions?.mileageFrom, selectionOptions?.mileageTo]);

  const hasSelectedFilter = Object.values(filters)?.some((value) => value);

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 mb-4',
        hasSelectedFilter && 'grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_87px]'
      )}
    >
      <Select
        value={filters?.brand ?? ''}
        onValueChange={(value) =>
          updateFilter('brand', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Brand" />
        </SelectTrigger>
        <SelectContent>
          {!!filters?.brand && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.brands?.map((brand) => (
            <SelectItem key={brand.value} value={brand.value}>
              {brand.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectionOptions?.yearFrom ?? ''}
        onValueChange={(value) =>
          updateSelection('yearFrom', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Year from" />
        </SelectTrigger>
        <SelectContent>
          {!!selectionOptions?.yearFrom && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.years?.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectionOptions?.yearTo ?? ''}
        onValueChange={(value) =>
          updateSelection('yearTo', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Year to" />
        </SelectTrigger>
        <SelectContent>
          {!!selectionOptions?.yearTo && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.years?.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectionOptions?.mileageFrom ?? ''}
        onValueChange={(value) =>
          updateSelection('mileageFrom', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Mileage from" />
        </SelectTrigger>
        <SelectContent>
          {!!selectionOptions?.mileageFrom && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.mileages?.map((mileage) => (
            <SelectItem key={mileage.value} value={String(mileage.value)}>
              {mileage.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectionOptions?.mileageTo ?? ''}
        onValueChange={(value) =>
          updateSelection('mileageTo', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Mileage to" />
        </SelectTrigger>
        <SelectContent>
          {!!selectionOptions?.mileageTo && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.mileages?.map((mileage) => (
            <SelectItem key={mileage.value} value={String(mileage.value)}>
              {mileage.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.location ?? ''}
        onValueChange={(value) =>
          updateFilter('location', value == 'all' ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {!!filters.location && (
            <SelectItem value="all" key={'all'}>
              All
            </SelectItem>
          )}
          {filterOptions?.locations?.map((location) => (
            <SelectItem key={location.value} value={location.value}>
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={sorting ?? ''}
        onValueChange={(value) => setSorting(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={SortState.Asc} value={SortState.Asc}>
            New set
          </SelectItem>
          <SelectItem key={SortState.Desc} value={SortState.Desc}>
            Ending soon first
          </SelectItem>
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
  );
};

export default SearchFilters;
