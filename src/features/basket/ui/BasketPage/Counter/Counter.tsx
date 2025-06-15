import { Minus, Plus } from 'lucide-react';
import s from './counter.module.scss';
import { Button } from '@/common/components/Button/Button';

export interface CounterProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const Counter = ({ value, onChange, min = 1, max = 10 }: CounterProps) => {
  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => onChange(value - 1);

  return (
    <div className={s.counter}>
      <Button
        type="button"
        className={s.counterBtn}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </Button>
      <span className={s.count}>{value}</span>
      <Button
        type="button"
        className={s.counterBtn}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};
