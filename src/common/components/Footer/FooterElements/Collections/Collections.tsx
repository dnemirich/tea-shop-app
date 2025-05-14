import styles from './Collections.module.css';

const Collections = () => {
  const teaArray = [
    'Black tea',
    'Green tea',
    'White tea',
    'Herbal tea',
    'Matcha',
    'Puer',
    'Oolong',
    'Rooibos',
    'Teaware',
  ] as const;

  return (
    <div className={styles.collection_section}>
      <h3 className={styles.title}>COLLECTIONS</h3>
      <ul className={styles.collections_list}>
        {teaArray.map((item) => (
          <li key={item} className={styles.tea_list}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collections;
