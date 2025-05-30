import React from 'react';
import { Promo } from '@/features/home/ui/Promo/Promo.tsx';
import { BenefitBar } from '@/features/home/ui/BenefitBar/BenefitBar.tsx';
import { TeaCards } from '@/features/home/ui/TeaCards/TeaCards.tsx';
import { Blog } from '@/features/home/ui/Blog/Blog.tsx';
import { Subscribe } from '@/features/home/ui/Subscribe/Subscribe.tsx';

export const HomePage: React.FC = () => {
  return (
    <div>
      <Promo />
      <BenefitBar />
      <TeaCards />
      <Blog />
      <Subscribe />
    </div>
  );
};
