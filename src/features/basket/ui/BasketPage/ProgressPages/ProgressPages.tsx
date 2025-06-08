import { DeliveryPage } from '../DeliveryPage/DeliveryPage';
import { MyBagPage } from '../MyBagPage/MyBagPage';

type Props = {
  selectedOption: 'MyBagPage' | 'DeliveryPage' | 'PaymentPage' | null;
};

export const ProgressPages: React.FC<Props> = ({ selectedOption }: Props) => {
  /*if (selectedOption === 'MyBagPage') {
    return (
      <div>
        <MyBagPage />
      </div>
    );
  }

  if (selectedOption === 'DeliveryPage') {
    return (
      <div>
        <DeliveryPage />
      </div>
    );
  }*/

  return (
    <div>
      <DeliveryPage />
    </div>
  );
};
