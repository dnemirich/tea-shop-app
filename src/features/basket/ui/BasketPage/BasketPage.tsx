import { ProgressPages } from './ProgressPages/ProgressPages';
import { Stepper } from './Stepper/Stepper';

export const BasketPage = () => {
  return (
    <div>
      <Stepper />
      <ProgressPages />
    </div>
  );
};
