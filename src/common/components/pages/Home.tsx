import React from 'react';
import { TeaPromo } from '../PromoPage/Promo';

import { TeaCards } from '../TeaCards/TeaCards';
import { BenefitBar } from '../BenefitBar/BenefitBar';
import { Subscribe } from '../Subscribe/Subscribe';
import { Blog } from '../BlogComponents/Blog';

const Home: React.FC = () => {
  return (
    <div>
      <TeaPromo />
      <BenefitBar />
      <TeaCards />
      <Blog />
      <Subscribe />
    </div>
  );
};

export default Home;
