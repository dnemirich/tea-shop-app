import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import s from './Popover.module.scss';

type MenuItem = {
  label: string;
  classname?: string;
  icon?: ReactNode;
  action: () => void;
};

type Props = {
  items: MenuItem[];
  trigger: ReactNode;
};

export const Popover = ({ items, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={s.wrapper} ref={popoverRef} onKeyDown={handleKeyDown} role="menu" tabIndex={0}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={s.trigger}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {isOpen && (
        <div className={s.popover} role="menu" tabIndex={-1}>
          <ul className={s.menuList}>
            {items.map((item, index) => (
              <li key={index} role="none">
                <button
                  className={`${s.menuItem} ${item.classname || ''}`}
                  role="menuitem"
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  ref={index === 0 ? firstMenuItemRef : null}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
