import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { Search, User, LogOut, ShoppingBasket } from 'lucide-react';
import LeafLogo from '@/assets/img/leafLogo.svg';
import { useUserStore } from '@/common/store/user-store.ts';
import { ROUTES } from '@/common/config/routes.ts';
import { authService } from '@/features/login/api/authService.ts';
import { useSearchStore } from '@/common/store/search-store';

export const Header = () => {
  const { isLoggedIn } = useUserStore();
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

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
            <li className={styles.menuItem}>SHOP</li>
            <li className={styles.menuItem}>BLOG</li>
            <li className={styles.menuItem}>ABOUT US</li>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoggedIn ? (
              <button onClick={handleLogout} className={styles.authButton}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={styles.authButton}>
                  <User size={18} />
                  <span>Login</span>
                </Link>
                <Link to={ROUTES.REGISTER} className={styles.registerButton}>
                  <span>Register</span>
                </Link>
              </>
            )}
            <Link to="/cart" aria-label="Go to cart? ">
              <button className={styles.iconButton} aria-label="Shopping basket">
                <ShoppingBasket size={24} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
