import { ItemsContainer } from '../ItemsContainer/ItemsContainer';
import { PopularOffers } from '../PopularOffers/PopularOffers';
import { RightSide } from '../RightSide/RightSide';
import s from './myBag.module.scss';

export const MyBag = () => {
  return (
    <div className={s.myBagWrapper}>
      <div className={s.subWrapper}>
        <ItemsContainer />
        <RightSide />
      </div>
      <PopularOffers />
    </div>
  );
};
