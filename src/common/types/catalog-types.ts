export type FilterOption = {
    name: string;
    selected: boolean;
  };
  
  export type FilterCategory = {
    title: string;
    options: FilterOption[];
    isToggle?: boolean;
  };