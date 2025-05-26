import { OptionList } from '../OptionList/OptionList';
import { Salutation } from '../Salutation/Salutation';
import s from './LeftSide.module.scss';

type Props = {
  setSelectedOption: (option: 'MyDetails' | 'Addresses') => void;
};

export const LeftSide = ({ setSelectedOption }: Props) => {
  return (
    <div className={s.leftSideWrapper}>
      <Salutation />
      <OptionList setSelectedOption={setSelectedOption} />
    </div>
  );
};
