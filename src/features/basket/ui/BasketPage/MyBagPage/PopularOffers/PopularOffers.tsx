import { Offers } from '../Offers/Offers';
import s from './popularOffers.module.scss';

export const PopularOffers = () => {
  return (
    <div className={s.popularOffersWrapper}>
      <p className={s.popularTitle}>Popular this season</p>
      <Offers />
    </div>
  );
};
