import { create } from 'zustand';
import type { ProductDiscount } from '@/common/types/discounts-types.ts';

type DiscountStore = {
  hasActiveDiscount: boolean;
  discount: ProductDiscount;
  setDiscount: (newDiscount: ProductDiscount) => void;
  setHasActiveDiscount: (hasActiveDiscount: boolean) => void;
};

export const useDiscountStore = create<DiscountStore>((set) => ({
  hasActiveDiscount: false,
  discount: {} as ProductDiscount,
  setDiscount: (newDiscount) => set({ discount: newDiscount }),
  setHasActiveDiscount: (hasActiveDiscount) => set({ hasActiveDiscount }),
}));
