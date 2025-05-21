import React from 'react';
import Promo from '../PromoPage/Promo';
import BenefitBar from '../BenefitBar/BenefitBar';
import TeaCards from '../TeaCards/TeaCards';

const Home: React.FC = () => {
  return (
    <div>
      <Promo />
      <BenefitBar />
      <TeaCards/>
    </div>
  );
};

export default Home;
