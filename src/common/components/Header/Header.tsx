import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { Search, User, LogOut, ShoppingBasket } from 'lucide-react';
import LeafLogo from '@/assets/img/leafLogo.svg';
import { useUserStore } from '@/common/store/user-store.ts';
import { ROUTES } from '@/common/config/routes.ts';
import { authService } from '@/features/login/api/authService.ts';
import { Popover } from '@/common/components/Popover/Popover.tsx';
import { useSearchStore } from '@/common/store/search-store';
import { useDebouncedSearch } from '@/common/hooks/useDebouncedSearch';
import { useCartStore } from '@/common/store/cart-store.ts';

export const Header = () => {
  const { isLoggedIn } = useUserStore();
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const cartItems = useCartStore().cart?.lineItems;

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const count = cartItems.reduce((counter, item) => {
        counter += item.quantity;
        return counter;
      }, 0);
      setItemsCount(count);
    } else {
      setItemsCount(0);
    }
  }, [cartItems]);

  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  const [inputValue, debouncedValue, setInputValue] = useDebouncedSearch('');

  const handleToggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
    setInputValue('');
  }, [setInputValue]);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (debouncedValue.length >= 2) {
      setSearchQuery(debouncedValue);
    } else {
      setSearchQuery('');
    }
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearch) {
        handleToggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, handleToggleSearch]);

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.HOME);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const navItems = isLoggedIn
    ? [
        {
          label: 'Logout',
          icon: <LogOut size={18} />,
          classname: styles.authButton,
          action: handleLogout,
        },
        {
          label: 'My account',
          classname: styles.registerButton,
          action: () => navigate(ROUTES.USER),
        },
      ]
    : [
        {
          label: 'Login',
          icon: <User size={18} />,
          classname: styles.authButton,
          action: () => navigate(ROUTES.LOGIN),
        },
        {
          label: 'Register',
          classname: styles.registerButton,
          action: () => navigate(ROUTES.REGISTER),
        },
      ];

  return (
    <header className={styles.header}>
      <div className={'container'}>
        <div className={styles.navbar}>
          <Link to={ROUTES.HOME} className={styles.logoLink}>
            <img src={LeafLogo} alt="Leaf & Lore Logo" className={styles.logo} />
            <span className={styles.websiteTitle}>Leaf & Lore</span>
          </Link>

          <button
            className={styles.burgerMenu}
            onClick={handleToggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>

          <ul className={`${styles.navList} ${isMenuOpen ? styles.menuOpen : ''}`}>
            <li className={styles.menuItem}>
              <Link to={ROUTES.SHOP}>SHOP</Link>
            </li>
            <li className={styles.menuItem}>BLOG</li>
            <li className={styles.menuItem}>
              <Link to={ROUTES.ABOUT}>ABOUT US</Link>
            </li>
          </ul>

          <div className={styles.iconsBox}>
            <div className={styles.searchWrapper}>
              <button
                onClick={handleToggleSearch}
                className={styles.iconButton}
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className={`${styles.searchInput} ${showSearch ? styles.visible : ''}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <Popover
              trigger={<User size={24} className={isLoggedIn ? `${styles.loggedTrigger}` : ''} />}
              items={navItems}
            />
            <Link to="/cart" aria-label="Go to cart?" className={styles.cartLink}>
              <button className={styles.iconButton} aria-label="Shopping basket">
                <ShoppingBasket size={24} />
              </button>
              {itemsCount > 0 && <span className={styles.itemsCount}>{itemsCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
