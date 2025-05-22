import React from 'react';
import Promo from '../PromoPage/Promo';
import BenefitBar from '../BenefitBar/BenefitBar';
import TeaCards from '../TeaCards/TeaCards';
import Blog from '../BlogComponents/Blog';
import Subscribe from '../Subscribe/Subscribe';

const Home: React.FC = () => {
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

export default Home;
