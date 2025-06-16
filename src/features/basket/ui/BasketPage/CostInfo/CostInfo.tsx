import s from './costInfo.module.scss';
import clsx from 'clsx';

interface CostInfoProps {
  text: string;
  value: string;
  className?: string;
  discountPrice: string;
}

export const CostInfo = ({ text, value, className, discountPrice }: CostInfoProps) => {
  const hasDiscount = discountPrice.length > 0;
  return (
    <div className={clsx(s.costWrapper, className)}>
      <p className={s.text}>{text}</p>
      <div className={s.prices}>
        <p className={`${s.cost} ${hasDiscount ? s.costDiscounted : ''}`}>{value}</p>
        {hasDiscount && <p className={s.discount}>{discountPrice}</p>}
      </div>
    </div>
  );
};
