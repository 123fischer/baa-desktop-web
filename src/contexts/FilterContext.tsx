'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Filters, Selections } from '@/types/types';
import { SortState } from '@/enums';

interface FilterContextType {
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string | number[] | null) => void;
  resetFilters: () => void;
  updateSelection: (key: any, value: string | null) => void;
  selectionOptions: any;
  sorting: string;
  setSorting: (value: string) => void;
  hasSelectedFilter: boolean;
}

const defaultFilters: Filters = {
  brand: null,
  firstRegistration: null,
  location: null,
  sortBy: null,
};

const selectionOptionsValues: Selections = {
  yearTo: null,
  yearFrom: null,
  mileageTo: null,
  mileageFrom: null,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectionOptions, setSelectionOptions] = useState<Selections>(
    selectionOptionsValues
  );

  const [sorting, setSorting] = useState<string>(SortState.Desc);

  const hasSelectedFilter = !Object.values(filters).every(
    (element) => element === null
  );

  const updateFilter = useCallback(
    (key: keyof Filters, value: string | number[] | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const updateSelection = useCallback(
    (key: keyof Selections, value: string | number[] | null) => {
      console.log('selectionOptionsValues>>', selectionOptionsValues);

      setSelectionOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectionOptions(selectionOptionsValues);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        resetFilters,
        selectionOptions,
        updateSelection,
        sorting,
        setSorting,
        hasSelectedFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
