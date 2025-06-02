import React, { useState } from 'react';
import styles from './teaCard.module.css';

export type TeaCardProps = {
  images?: string[];
  name?: string;
  description?: string;
  price?: number;
  weight?: string;
  className?: string;
};

export const TeaCard: React.FC<TeaCardProps> = ({
  images = ['https://via.placeholder.com/300'],
  name = 'Product Name',
  description = 'No description available',
  price = 0,
  weight = '',
  className = '',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const maxLength = 100;

  const shortDescription =
    description.length > maxLength ? description.slice(0, maxLength) + '...' : description;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
      <div className={`${styles.card} ${className}`}>
        <div className={styles.imageContainer}>
          <img
            src={images[currentImageIndex]}
            alt={name}
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
            }}
          />

          {images.length > 1 && (
            <>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={prevImage}
                aria-label="Previous image"
              >
                &lt;
              </button>
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={nextImage}
                aria-label="Next image"
              >
                &gt;
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <div className={styles.content}>
          <h3 className={styles.name} title={name}>
            {name}
          </h3>

          <p
            className={styles.description}
            title={description}
            style={{ cursor: description.length > maxLength ? 'pointer' : 'default' }}
            onMouseEnter={() => {
              if (description.length > maxLength) setExpanded(true);
            }}
            onMouseLeave={() => {
              if (description.length > maxLength) setExpanded(false);
            }}
          >
            {expanded ? description : shortDescription}
          </p>

          <div className={styles.priceContainer}>
            <span className={styles.price}>{formattedPrice}</span>
            <span className={styles.weight}>/ {weight}</span>
          </div>
        </div>
      </div>
  );
};
