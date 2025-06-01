import { Home, KeyRound, User } from 'lucide-react';
import s from './OptionList.module.scss';
import { Button } from '@/common/components/Button/Button';

type Props = {
  setSelectedOption: (option: 'MyDetails' | 'Addresses' | 'PasswordChange') => void;
};

export const OptionList: React.FC<Props> = ({ setSelectedOption }) => {
  return (
    <div className={s.optionsWrapper}>
      <Button type="button" onClick={() => setSelectedOption('MyDetails')}>
        <User size={14} />
        <span>my details</span>
      </Button>
      <Button type="button" onClick={() => setSelectedOption('PasswordChange')}>
        <KeyRound size={14} />
        <span>password</span>
      </Button>
      <Button type="button" onClick={() => setSelectedOption('Addresses')}>
        <Home size={14} />
        <span>addresses</span>
      </Button>
    </div>
  );
};
