import { Home, User } from 'lucide-react';
import s from './OptionList.module.scss';
import { Button } from '@/common/components/Button/Button';

export const OptionList: React.FC = () => {
  return (
    <div className={s.optionsWrapper}>
      <Button type="submit" text="my details" icon={<User size={14} />} />
      <Button type="submit" text="addresses" icon={<Home size={14} />} />
    </div>
  );
};
