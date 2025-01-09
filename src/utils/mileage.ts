export const parseMileage = (mileageStr: string): number => {
    return parseInt(mileageStr.replace(/[^0-9]/g, ''));
  };
  
  export const formatMileage = (miles: number): string => {
    return `${miles.toLocaleString()} miles`;
  };