import React from 'react';
import { Promo } from '@/features/home/ui/Promo/Promo.tsx';
import { BenefitBar } from '@/features/home/ui/BenefitBar/BenefitBar.tsx';
import { TeaCards } from '@/features/home/ui/TeaCards/TeaCards.tsx';
import { Blog } from '@/features/home/ui/Blog/Blog.tsx';
import { Subscribe } from '@/features/home/ui/Subscribe/Subscribe.tsx';
import { Marquee } from '@/features/home/ui/Marquee/Marquee.tsx';
import { useDiscountStore } from '@/common/store/discount-store.ts';
import { DiscountPopup } from '@/features/home/ui/DiscountPopup/DiscountPopup.tsx';

export const HomePage: React.FC = () => {
  const { discount, hasActiveDiscount } = useDiscountStore();

  return (
    <div>
      {hasActiveDiscount && <Marquee info={discount} />}
      <Promo />
      <BenefitBar />
      <TeaCards />
      <Blog />
      <Subscribe />
      <DiscountPopup />
    </div>
  );
};
