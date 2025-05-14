import styles from './Learn.module.css';

const Learn = () => {
  return (
    <div className={styles.learn_section}>
      <h3 className={styles.title}>LEARN</h3>
      <ul className={styles.list}>
        <li>About us</li>
        <li>Blog</li>
      </ul>
    </div>
  );
};

export default Learn;
