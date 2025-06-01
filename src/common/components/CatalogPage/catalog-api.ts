import { apiRoot } from '@/common/config/api-client.ts';
import { Product } from './Types/catalogTypes';

export const fetchCategories = async (): Promise<Record<string, string>> => {
  const response = await apiRoot.categories().get().execute();
  return response.body.results.reduce(
    (acc, category) => {
      acc[category.id] = category.name['en-US'] || '';
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const fetchProducts = async (categories: Record<string, string>): Promise<Product[]> => {
  const response = await apiRoot
    .productProjections()
    .get({
      queryArgs: {
        where: 'published=true',
        limit: 100,
        expand: ['categories[*]'],
      },
    })
    .execute();

  return response.body.results.map((product) => {
    const attrs = product.masterVariant.attributes || [];

    const getVal = (name: string) => attrs.find((a) => a.name === name)?.value;
    const getList = (name: string): string[] => {
      const val = getVal(name);
      if (!Array.isArray(val)) return [];
      return val.map((v) => v['en-US'] || v['ru'] || '').filter(Boolean);
    };

    const catId = product.categories?.[0]?.id;
    return {
      id: product.id,
      productType: categories[catId] || 'Unknown',
      name: product.name?.['en-US'] || '',
      description: product.description?.['en-US'] || '',
      price: getVal('price-per-ounce') || 0,
      currency: product.masterVariant.prices?.[0]?.value?.currencyCode || 'USD',
      images: product.masterVariant.images?.map((img) => img.url) || [
        'https://via.placeholder.com/150',
      ],
      weight: 100,
      flavor: getList('flavor'),
      origin: getVal('origin')?.['en-US'] || '',
      hasCaffeine: !getVal('caffeine-free'),
      ingredients: getList('ingredients'),
      color: getVal('color')?.['en-US'] || '',
    };
  });
};
