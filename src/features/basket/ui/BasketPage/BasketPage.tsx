import { useState } from 'react';
import { ProgressPages } from './ProgressPages/ProgressPages';
import { Stepper } from './Stepper/Stepper';

export const BasketPage = () => {
  const [selectedOption, setSelectedOption] = useState<
    'MyBagPage' | 'DeliveryPage' | 'PaymentPage' | null
  >(null);

  return (
    <div>
      <Stepper />
      <ProgressPages selectedOption={selectedOption} />
    </div>
  );
};
