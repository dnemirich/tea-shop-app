import s from './ProductCounter.module.scss';
import { Button } from '@/common/components/Button/Button.tsx';
import { Minus, Plus } from 'lucide-react';

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

export const ProductCounter = ({ quantity, setQuantity }: Props) => {
  return (
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
  );
};

/*import s from './ProductCounter.module.scss';
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
};*/
