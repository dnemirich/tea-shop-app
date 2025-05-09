import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';
import { Search, User, ShoppingBag } from 'lucide-react';
import LeafLogo from '../../../assets/img/leafLogo.svg';

export const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <div className={styles.navbar}>
      <img src={LeafLogo} alt="" className={styles.logo} />
      <span className={styles.websiteTitle}>Leaf & Lore</span>

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

        <button className={styles.iconButton} aria-label="User account">
          <User size={18} />
        </button>
        <button className={styles.iconButton} aria-label="Shopping bag">
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
