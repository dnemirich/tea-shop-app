export type Product = {
  id: string;
  productType: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  weight?: number;
  flavor?: string[];
  origin?: string;
  hasCaffeine?: boolean;
  ingredients?: string[];
};
//filter types
export type TeaFilterProps = {
  selectedFlavors: string[];
  selectedOrigins: string[];
  selectedCaffeine: boolean | null;
  selectedTeaTypes: string[];
  onFlavorToggle: (name: string) => void;
  onOriginToggle: (name: string) => void;
  onCaffeineToggle: (checked: boolean) => void;
  onTeaTypeToggle: (name: string) => void;
};

//sort types
export type SortOption = {
  value: string;
  label: string;
};

export type SortByProps = {
  onSortChange?: (value: string) => void;
};

//card types
export type TeaCardProps = {
  images?: string[];
  name?: string;
  description?: string;
  price?: number;
  weight?: number;
  className?: string;
};

//pagination sort
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

export type OutOfStockProps = {
  navigateToHome: () => void;
  onResetFilters: () => void;
};

export type DiscontPrice = {
  originalPrice: number;
  discountedPrice?: number;
};
