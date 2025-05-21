import React from 'react';
import styles from './promo.module.css';

const TeaPromo: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src="/img/Img-index-page/Main-image.png"
          alt="Various loose teas on spoons"
          className={styles.image}
        />
      </div>

      <div className={styles.textWrapper}>
        <h2 className={styles.title}>
          Every day is unique, <br /> just like our tea
        </h2>
        <p className={styles.paragraph}>
          Discover hand-picked teas from around the world — from calming herbal blends to bold,
          energizing infusions. At Leaf & Lore, we believe every cup tells a story. Explore our
          collection and find your next favorite brew.
        </p>
        <p className={styles.paragraph}>
          Let each sip transport you — to misty mountain gardens, ancient rituals, and quiet moments
          of reflection. Whether you are seeking comfort, clarity, or curiosity in a cup, you will
          find it here.
        </p>
        <button className={styles.button}>BROWSE TEAS</button>
      </div>
    </section>
  );
};

export default TeaPromo;
