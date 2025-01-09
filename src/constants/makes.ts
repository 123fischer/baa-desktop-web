export const makes = [
  { value: 'audi', label: 'Audi' },
  { value: 'bmw', label: 'BMW' },
  { value: 'honda', label: 'Honda' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'porsche', label: 'Porsche' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'volkswagen', label: 'Volkswagen' },
] as const;

export type Make = (typeof makes)[number]['value'];
