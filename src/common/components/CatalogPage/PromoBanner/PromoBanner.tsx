import React from 'react';
import styles from './promobanner.module.css'

export const PromoBanner = () => {
  return (
    <div className={styles.promoImage}>
      <img
        src="/img/catalog-page/catalog-image.png"
        alt="catalog_img"
        className={styles.catalogHeaderImage}
      />
    </div>
  );
};
