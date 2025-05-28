import { Home, User } from 'lucide-react';
import s from './OptionList.module.scss';
import { Button } from '@/common/components/Button/Button';

type Props = {
  setSelectedOption: (option: 'MyDetails' | 'Addresses') => void;
};

export const OptionList: React.FC<Props> = ({ setSelectedOption }) => {
  return (
    <div className={s.optionsWrapper}>
      <Button
        type="submit"
        text="my details"
        icon={<User size={14} />}
        onClick={() => setSelectedOption('MyDetails')}
      />
      <Button
        type="submit"
        text="address book"
        icon={<Home size={14} />}
        onClick={() => setSelectedOption('Addresses')}
      />
    </div>
  );
};
