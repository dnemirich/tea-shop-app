import s from './Marquee.module.scss';
import type { ProductDiscount } from '@/common/types/discounts-types.ts';

type Props = {
  info: ProductDiscount;
};

export const Marquee = ({ info }: Props) => {
  const { name, references, value } = info;

  const message = `${name}! ${value}% discount on teas from the following categories: ${references.map((ref) => ref.split('-').join(' ')).join(', ')}. `;

  return (
    <div className={s.marquee}>
      <div className={s.track}>
        <span className={s.message}>{message.repeat(10)}</span>
      </div>
    </div>
  );
};
