import { Home, User } from 'lucide-react';
import s from './OptionList.module.scss';

export const OptionList: React.FC = () => {
  return (
    <div className={s.optionsWrapper}>
      <button>
        <User size={14} />
        <span>My details</span>
      </button>
      <button>
        <Home size={14} />
        <span>Addresses</span>
      </button>
    </div>
  );
};
