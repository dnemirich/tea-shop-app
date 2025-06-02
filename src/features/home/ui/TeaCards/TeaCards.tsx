import React from 'react';
import styles from './TeaCards.module.scss';
import { SectionHeading } from '@/features/home/ui/SectionHeading/SectionHeading.tsx';
import { TEA_CATEGORIES } from '@/common/constants/categories-constants.ts';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';

type Props = {
  item: {
    label: string;
    image: string;
    description: string;
    link: string;
  };
};

const TeaCard: React.FC<Props> = ({ item }) => {
  const { image, description, link, label } = item;
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={`/img/Img-index-page/${image}`}
          alt={label}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <h3 className={styles.title}>
        <Link to={`${ROUTES.SHOP}/${link}`}>{label}</Link>
      </h3>
    </div>
  );
};

export const TeaCards: React.FC = () => {
  return (
    <section className={styles.container}>
      <SectionHeading title="Our Collections" />

      <div className={styles.grid}>
        {TEA_CATEGORIES.map((tea, index) => (
          <TeaCard key={index} item={tea} />
        ))}
      </div>
    </section>
  );
};
