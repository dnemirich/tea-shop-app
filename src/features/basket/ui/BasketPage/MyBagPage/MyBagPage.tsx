import { ItemsContainer } from './ItemsContainer/ItemsContainer';
import s from './myBag.module.scss';
import { PopularOffers } from './PopularOffers/PopularOffers';

export const MyBagPage = () => {
  return (
    <div className={s.myBagWrapper}>
      <ItemsContainer />
      <PopularOffers />
    </div>
  );
};
