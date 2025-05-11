import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router
import styles from './Navbar.module.css';
import { Search, User, LogOut, ShoppingBag } from 'lucide-react';
import LeafLogo from '../../../assets/img/leafLogo.svg';

export const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would typically come from auth context
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  // These would be replaced with actual auth logic
  //   const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <img src={LeafLogo} alt="Leaf & Lore Logo" className={styles.logo} />
        <span className={styles.websiteTitle}>Leaf & Lore</span>
      </Link>

      <ul>
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
          <>
            <button onClick={handleLogout} className={styles.authButton} aria-label="Log out">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
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

        <button className={styles.iconButton} aria-label="Shopping bag">
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
