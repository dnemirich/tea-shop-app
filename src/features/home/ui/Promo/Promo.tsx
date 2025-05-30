import React from 'react';
import styles from './promo.module.css';
import { SectionHeading } from '@/features/home/ui/SectionHeading/SectionHeading.tsx';
import { Button } from '@/common/components/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';

export const Promo: React.FC = () => {
  const navigate = useNavigate();
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
        <SectionHeading title="Every day is unique, just like our tea" />
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
        <Button className={styles.button} onClick={() => navigate(ROUTES.SHOP)}>
          Browse teas
        </Button>
      </div>
    </section>
  );
};
