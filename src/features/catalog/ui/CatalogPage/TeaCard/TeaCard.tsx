import React, { useEffect, useState } from 'react';
import styles from './teaCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';
import { useDiscountStore } from '@/common/store/discount-store.ts';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/common/components/Button/Button';
// import { useCartStore } from '@/common/store/cart-store';

export type TeaCardProps = {
  images?: string[];
  name?: string;
  description?: string;
  price?: number;
  weight?: string;
  className?: string;
  slug: string;
  productType: string;
  productId: string;
};

export const TeaCard: React.FC<TeaCardProps> = ({
  images = ['https://via.placeholder.com/300'],
  name = 'Product Name',
  description = 'No description available',
  price = 0,
  weight = '',
  className = '',
  slug = '',
  productType = '',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [discountSize, setDiscountSize] = useState(0);
  const { discount } = useDiscountStore();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (
      discount.isActive &&
      discount.references.includes(productType.toLowerCase().split(' ').join('-'))
    ) {
      setDiscountSize(discount.value);
    }
  }, [discount, productType]);

  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const discountedPrice = (price - (price * discountSize) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const category = productType.toLowerCase().split(' ').join('-');

  const maxLength = 100;
  const navigate = useNavigate();

  const shortDescription =
    description.length > maxLength ? description.slice(0, maxLength) + '...' : description;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onClick = () => {
    navigate(`${ROUTES.SHOP}/${category}/${slug}`);
  };

  const { addItem, isLoading } = useCartStore();

  const handleAddtoCartButton = async () => {
    try {
      await addItem(productId, 0);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1000);
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  return (
    <div className={`${styles.card} ${className}`}>
      {discountSize > 0 && <div className={styles.discountBadge}>on sale</div>}
      <div className={styles.imageContainer}>
        <img
          src={images[currentImageIndex]}
          alt={name}
          className={styles.image}
          loading="lazy"
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
        <button className={styles.name} title={name} onClick={onClick}>
          {name}
        </button>

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
          <div className={discountSize > 0 ? styles.discountedPrice : ''}>
            <span className={styles.price}>{formattedPrice}</span>
            <span className={styles.weight}> / {weight}</span>
          </div>
          {discountSize > 0 && (
            <div className={styles.discount}>
              <span className={styles.price}>{discountedPrice}</span>
              <span className={styles.weight}> / {weight}</span>
            </div>
          )}
          <Button className={styles.addToCartButton} onClick={handleAddtoCartButton}>
            {' '}
            {addedToCart ? <Check /> : <ShoppingBag />}
          </Button>
        </div>
      </div>
    </div>
  );
};
