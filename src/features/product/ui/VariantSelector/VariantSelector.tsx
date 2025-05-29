import Sample from '@/assets/icons/sample-icon.svg';
import Bag50 from '@/assets/icons/bag-50-icon.svg';
import Bag100 from '@/assets/icons/bag-100-icon.svg';
import Bag250 from '@/assets/icons/bag-250-icon.svg';
import s from './VariantSelector.module.scss';
import { useState } from 'react';

const OUNCE_SIZE = 28.35;
const VARIANTS = [
  {
    title: 'Sample',
    icon: Sample,
    value: 'sample',
  },
  {
    title: '50 g bag',
    icon: Bag50,
    value: '50',
  },
  {
    title: '100 g bag',
    icon: Bag100,
    value: '100',
  },
  {
    title: '250 g bag',
    icon: Bag250,
    value: '250',
  },
];

type Props = {
  price: number;
  onPriceChange: (price: number) => void;
};

export const VariantSelector = ({ onPriceChange, price }: Props) => {
  const [selectedValue, setSelectedValue] = useState('sample');

  return (
    <>
      <p className={s.variantsHeading}>Variants</p>
      <div role={'radiogroup'} className={s.variants}>
        {VARIANTS.map((variant, index) => (
          <label
            className={`${s.variant} ${selectedValue === variant.value ? s.selected : ''}`}
            key={index}
          >
            <input
              type={'radio'}
              name={'weight'}
              value={variant.value}
              hidden
              onChange={() => {
                if (variant.value === 'sample') {
                  onPriceChange(price);
                } else {
                  onPriceChange((price / OUNCE_SIZE) * Number(variant.value));
                }
                setSelectedValue(variant.value);
              }}
            />
            <img src={variant.icon} alt={variant.title} width={50} height={50} />
            <span>{variant.title}</span>
          </label>
        ))}
      </div>
    </>
  );
};
