import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Search, User, LogOut } from 'lucide-react';
import LeafLogo from '../../../assets/img/leafLogo.svg';
import ShoppingCart from '../ShoppingBasket/ShoppingBasket';

export const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const handleLogout = () => setIsLoggedIn(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
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
        <li>SHOP</li>
        <li>BLOG</li>
        <li>ABOUT US</li>
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
          />
        </div>

        {isLoggedIn ? (
          <button onClick={handleLogout} className={styles.authButton}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <Link to="/login" className={styles.authButton}>
              <User size={18} />
              <span>Login</span>
            </Link>
            <Link to="/register" className={styles.registerButton}>
              <span>Register</span>
            </Link>
          </>
        )}
        <ShoppingCart />
      </div>
    </div>
  );
};

export default NavBar;
