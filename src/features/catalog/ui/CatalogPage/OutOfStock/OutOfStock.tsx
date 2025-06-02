import styles from './outOfStock.module.css';

type OutOfStockProps = {
  navigateToHome: () => void;
  onResetFilters: () => void;
};
export const OutOfStock: React.FC<OutOfStockProps> = ({ navigateToHome, onResetFilters }) => (
  <div className={styles.outOfStockContainer}>
    <div className={styles.outOfStockContent}>
      <h2>Упс! Товар закончился</h2>
      <p>Мы уже работаем над новыми поставками. Пожалуйста, загляните позже!</p>
      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={navigateToHome}>
          Вернуться на главную
        </button>
        <button className={styles.secondaryButton} onClick={onResetFilters}>
          Посмотреть другие категории
        </button>
      </div>
    </div>
  </div>
);
