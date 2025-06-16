import { useEffect, useState } from 'react';
import s from './offers.module.scss';
import { OfferCard } from '../OfferCard/OfferCard';
import { fetchCategories, fetchProducts } from '@/features/catalog/api/catalog-api.ts';
import type { Product } from '@/common/types/catalog-types.ts';

export const Offers = () => {
  const [randomTeas, setRandomTeas] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories().then((categories) =>
      fetchProducts(categories).then((res) => {
        const products = res || [];
        const shuffled = products.sort(() => 0.5 - Math.random());
        setRandomTeas(shuffled.slice(0, 3));
      }),
    );
  }, []);

  return (
    <div className={s.teasWrapper}>
      {randomTeas.map((tea) => {
        const image = (tea.images && tea.images[0]) || '';
        const name = tea.name || '';
        const price = `€${tea.price}`;
        const category = tea.productType.toLowerCase().split(' ').join('-');

        return (
          <OfferCard
            key={tea.id}
            link={`${category}/${tea.slug}`}
            name={name}
            image={image}
            price={price}
          />
        );
      })}
    </div>
  );
};
