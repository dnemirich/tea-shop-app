import React from 'react';
import styles from './benefitbar.module.css';
import {
  Coffee as TeaCup,
  BadgeCheck as Certificate,
  Truck as DeliveryCar,
  Tag,
} from 'lucide-react';

const benefits = [
  {
    icon: <TeaCup size={24} />,
    text: '250+ kind of loose tea',
  },
  {
    icon: <Certificate size={24} />,
    text: 'Certificated organic teas',
  },
  {
    icon: <DeliveryCar size={24} />,
    text: 'Free delivery',
  },
  {
    icon: <Tag size={24} />,
    text: 'Samples for all teas',
  },
];

export const BenefitBar: React.FC = () => {
  return (
    <section className={styles.wrapper}>
      <ul className={styles.list}>
        {benefits.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
