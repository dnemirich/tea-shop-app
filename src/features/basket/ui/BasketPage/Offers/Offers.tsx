import { getProducts } from '@/common/api/products-api';
import { useEffect, useState } from 'react';
import { OfferCard } from '../OfferCard/OfferCard';
import { ProductProjection } from '@commercetools/platform-sdk';
import s from './offers.module.scss';

export const Offers = () => {
  const [randomTeas, setRandomTeas] = useState<ProductProjection[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await getProducts();
      const products = response.body?.results || [];

      const shuffled = products.sort(() => 0.5 - Math.random());
      setRandomTeas(shuffled.slice(0, 3));
    }

    fetchProducts();
  }, []);

  return (
    <div className={s.teasWrapper}>
      {randomTeas.map((tea) => {
        const image = tea.masterVariant.images?.[0]?.url || '';
        const name = tea.name['en-US'] || '';

        const rawPrice = tea.masterVariant.attributes?.find(
          (attr) => attr.name === 'price-per-ounce',
        )?.value;
        const price = rawPrice ? `€${Number(rawPrice).toFixed(2)}` : 'Price unavailable';

        return <OfferCard key={tea.id} name={name} image={image} price={price} />;
      })}
    </div>
  );
};
