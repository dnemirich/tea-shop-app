import { Addresses } from '../Addresses/Addresses';
import { MyDetails } from '../MyDetails/MyDetails';
import Image from '../userPageImg.jpg';
import s from './RightSide.module.scss';

type Props = {
  selectedOption: 'MyDetails' | 'Addresses' | null;
};

export const RightSide: React.FC<Props> = ({ selectedOption }) => {
  if (selectedOption === 'MyDetails') {
    return <MyDetails />;
  }

  if (selectedOption === 'Addresses') {
    return <Addresses />;
  }

  return (
    <div className={s.wrapper}>
      <img src={Image} alt="Background" />
    </div>
  );
};
