/*import s from './ProductCounter.module.scss';
import { Button } from '@/common/components/Button/Button.tsx';
import { Minus, Plus, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';

export const ProductCounter = () => {
  let [productCount, setProductCount] = useState(0);
  return (
    <div className={s.counterContainer}>
      <div className={s.counter}>
        <Button
          disabled={productCount === 0}
          className={s.counterBtn}
          onClick={() => setProductCount((prev) => prev - 1)}
        >
          <Minus />
        </Button>
        <span className={s.count}>{productCount}</span>
        <Button
          disabled={productCount === 10}
          className={s.counterBtn}
          onClick={() => setProductCount((prev) => prev + 1)}
        >
          <Plus />
        </Button>
      </div>
      <Button className={s.btn}>
        <ShoppingBasket />
        Add to bag
      </Button>
    </div>
  );
};
*/

//мое
import s from './ProductCounter.module.scss';
import { Button } from '@/common/components/Button/Button.tsx';
import { Minus, Plus } from 'lucide-react';

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

export const ProductCounter = ({ quantity, setQuantity }: Props) => {
  return (
    <div className={s.counterContainer}>
      <div className={s.counter}>
        <Button
          disabled={quantity === 0}
          className={s.counterBtn}
          onClick={() => setQuantity(quantity - 1)}
        >
          <Minus />
        </Button>
        <span className={s.count}>{quantity}</span>
        <Button
          disabled={quantity === 10}
          className={s.counterBtn}
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};
