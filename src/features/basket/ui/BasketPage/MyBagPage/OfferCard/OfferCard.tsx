import s from './offerCard.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';

type OfferCardProps = {
  image: string;
  name: string;
  price: string;
  link: string;
};

export const OfferCard = ({ image, name, price, link }: OfferCardProps) => {
  return (
    <div className={s.card}>
      <img src={image} alt={name} />
      <Link className={s.name} to={`${ROUTES.SHOP}/${link}`}>
        {name}
      </Link>
      <p className={s.price}>{price} / ounce </p>
    </div>
  );
};
