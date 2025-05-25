import { Home, User } from 'lucide-react';
import s from './OptionList.module.scss';

export const OptionList: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <button>
        <User size={20} />
        <span>My details</span>
      </button>
      <button>
        <Home size={20} />
        <span>Address book</span>
      </button>
    </div>
  );
};
