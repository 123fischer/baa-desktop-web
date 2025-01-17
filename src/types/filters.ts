export type SingleFilterOptions = { label: string; value: any }[];

export type FilterOptions = {
  brands: SingleFilterOptions;
  years: SingleFilterOptions;
  mileages: SingleFilterOptions;
  locations: SingleFilterOptions;
};

