import s from './costInfo.module.scss';
import clsx from 'clsx';

type CostInfoProps = {
  text: string;
  className?: string;
};

export const CostInfo = ({ text, className }: CostInfoProps) => {
  return (
    <div className={clsx(s.costWrapper, className)}>
      <p>{text}</p>
      <p className={s.cost}>cost</p>
    </div>
  );
};
