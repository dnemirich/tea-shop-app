import { Link } from 'react-router-dom';
import styles from './ShoppingBasket.module.css';
import { ShoppingBag } from 'lucide-react';

const ShoppingCart = () => {
  return (
    <div>
      <Link to="/cart" aria-label="Go to cart? ">
        <button className={styles.iconButton} aria-label="Shopping basket">
          <ShoppingBag size={18} />
        </button>
      </Link>
    </div>
  );
};

export default ShoppingCart;
