import { ItemsContainer } from './ItemsContainer/ItemsContainer';
import s from './myBag.module.scss';
import { PopularOffers } from './PopularOffers/PopularOffers';
import { RightSide } from './RightSide/RightSide';

export const MyBagPage = () => {
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
