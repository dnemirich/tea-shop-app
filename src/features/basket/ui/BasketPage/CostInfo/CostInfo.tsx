import s from './costInfo.module.scss';
import clsx from 'clsx';

interface CostInfoProps {
  text: string;
  value: string;
  className?: string;
}

export const CostInfo = ({ text, value, className }: CostInfoProps) => {
  return (
    <div className={clsx(s.costWrapper, className)}>
      <p className={s.text}>{text}</p>
      <p className={s.cost}>{value}</p>
    </div>
  );
};
