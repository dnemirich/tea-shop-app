import React from 'react';
import Promo from '../PromoPage/Promo';
import BenefitBar from '../BenefitBar/BenefitBar';
import TeaCards from '../TeaCards/TeaCards';
import Blog from '../BlogComponents/Blog';

const Home: React.FC = () => {
  return (
    <div>
      <Promo />
      <BenefitBar />
      <TeaCards />
      <Blog />
    </div>
  );
};

export default Home;
