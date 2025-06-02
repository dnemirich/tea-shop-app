import React, { useEffect, useState } from 'react';
import { Promo } from '@/features/home/ui/Promo/Promo.tsx';
import { BenefitBar } from '@/features/home/ui/BenefitBar/BenefitBar.tsx';
import { TeaCards } from '@/features/home/ui/TeaCards/TeaCards.tsx';
import { Blog } from '@/features/home/ui/Blog/Blog.tsx';
import { Subscribe } from '@/features/home/ui/Subscribe/Subscribe.tsx';
import { getDiscountsInfo } from '@/common/utils/discountHelpers.ts';
import type { ProductDiscount } from '@/common/types/discounts-types.ts';
import { Marquee } from '@/features/home/ui/Marquee/Marquee.tsx';

export const HomePage: React.FC = () => {
  const [discount, setDiscount] = useState<ProductDiscount | null>(null);

  useEffect(() => {
    getDiscountsInfo().then((discountInfo) => setDiscount(discountInfo));
  }, []);
  return (
    <div>
      {discount?.isActive && <Marquee info={discount} />}
      <Promo />
      <BenefitBar />
      <TeaCards />
      <Blog />
      <Subscribe />
    </div>
  );
};
