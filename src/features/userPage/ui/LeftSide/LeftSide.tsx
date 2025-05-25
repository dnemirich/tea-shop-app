import { OptionList } from '../OptionList/OptionList';
import { Salutation } from '../Salutation/Salutation';
import s from './LeftSide.module.scss';

export const LeftSide = () => {
  return (
    <div className={s.leftSideWrapper}>
      <Salutation />
      <OptionList />
    </div>
  );
};
