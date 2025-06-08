import s from './offerCard.module.scss';

type OfferCardProps = {
  image: string;
  name: string;
  price: string;
};

export const OfferCard = ({ image, name, price }: OfferCardProps) => {
  return (
    <div className={s.cardWrapper}>
      <img src={image} alt={name} />
      <p className={s.name}>{name}</p>
      <p className={s.price}>{price} / 50g</p>
    </div>
  );
};
