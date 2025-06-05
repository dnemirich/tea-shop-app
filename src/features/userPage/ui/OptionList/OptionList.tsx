import { Home, KeyRound, User } from 'lucide-react';
import s from './OptionList.module.scss';
import { Button } from '@/common/components/Button/Button';
import { useState, useEffect } from 'react';

type Props = {
  setSelectedOption: (option: 'MyDetails' | 'Addresses' | 'PasswordChange') => void;
};

export const OptionList: React.FC<Props> = ({ setSelectedOption }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 925);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (option: 'MyDetails' | 'Addresses' | 'PasswordChange') => {
    setSelectedOption(option);
    setIsMenuOpen(false);
  };

  return (
    <div className={s.optionsWrapper}>
      {isMobile ? (
        <div className={s.burgerMenuWrapper}>
          <button className={s.burgerButton} onClick={() => setIsMenuOpen((prev) => !prev)}>
            <span className={s.burgerLine}></span>
            <span className={s.burgerLine}></span>
            <span className={s.burgerLine}></span>
          </button>

          {isMenuOpen && (
            <div className={s.dropdownMenu}>
              <button className={s.menuItem} onClick={() => handleSelect('MyDetails')}>
                my details
              </button>
              <button className={s.menuItem} onClick={() => handleSelect('PasswordChange')}>
                password
              </button>
              <button className={s.menuItem} onClick={() => handleSelect('Addresses')}>
                addresses
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
