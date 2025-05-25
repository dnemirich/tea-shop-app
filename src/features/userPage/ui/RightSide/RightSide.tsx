import Image from '../userPageImg.jpg';
import s from './RightSide.module.scss';

export const RightSide = () => {
  return (
    <div className={s.wrapper}>
      <img src={Image} alt="Background" />
    </div>
  );
};
