import React from 'react';
import styles from './teacardcomponent.module.css';

type TeaCardProps = {
  imageSrc?: string;
  name?: string;
  description?: string;
  price?: number;
  weight?: number;
  className?: string;
};

export const TeaCardComponent: React.FC<TeaCardProps> = ({ 
  imageSrc = 'https://via.placeholder.com/300',
  name = 'Product Name',
  description = 'No description available',
  price = 0,
  weight = 100,
  className = ''
}) => {

  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.imageContainer}>
        <img 
          src={imageSrc} 
          alt={name}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
          }}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name} title={name}>
          {name}
        </h3>
        
        <p className={styles.description} title={description}>
          {description}
        </p>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formattedPrice}</span>
          <span className={styles.weight}>/ {weight}g</span>
        </div>
      </div>
    </div>
  );
};