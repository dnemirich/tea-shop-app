import { Button } from '@/common/components/Button/Button';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import s from './counter.module.scss';

export const Counter = () => {
  let [productCount, setProductCount] = useState(0);

  return (
    <div>
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
    </div>
  );
};
