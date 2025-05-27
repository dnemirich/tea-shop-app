import { useState, useEffect } from 'react';
import { TeaCardComponent } from '../TeaCardComponent/TeaCardComponent';
import styles from './catalog.module.css';
import { apiRoot } from '@/common/config/api-client.ts';

type Product = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  weight?: number;
};

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRoot
          .productProjections()
          .get({
            queryArgs: {
              limit: 6,
              where: 'published=true',
            },
          })
          .execute();

        const mappedProducts = response.body.results.map((product) => ({
          id: product.id,
          name: product.name?.['en'] || product.name?.['ru'] || 'Unnamed Product',
          description: product.description?.['en'] || product.description?.['ru'] || '',
          price: product.masterVariant.prices?.[0]?.value.centAmount / 100 || 0,
          imageUrl: product.masterVariant.images?.[0]?.url || 'https://via.placeholder.com/150',
          weight: 100,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (products.length === 0) return <div className={styles.empty}>No products found</div>;

  return (
    <div className={styles.catalogContainer}>
      {products.map((product) => (
        <TeaCardComponent
          key={product.id}
          imageSrc={product.imageUrl}
          name={product.name}
          description={product.description}
          price={product.price}
          weight={product.weight}
        />
      ))}
    </div>
  );
};
