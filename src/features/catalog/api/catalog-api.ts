import { apiRoot } from '@/common/config/api-client.ts';
import { Product, Category, ProductProjection } from '@/common/types/catalog-types.ts';

export const fetchCategories = async (): Promise<Record<string, string>> => {
  const response = await apiRoot.categories().get().execute();
  return response.body.results.reduce<Record<string, string>>((acc, category: Category) => {
    acc[category.id] = category.name['en-US'] || '';
    return acc;
  }, {});
};

const mapProduct = (product: ProductProjection, categories: Record<string, string>): Product => {
  const attrs = product.masterVariant.attributes || [];
  const getVal = (name: string) => attrs.find((a) => a.name === name)?.value;
  const getList = (name: string): string[] => {
    const val = getVal(name);
    if (!Array.isArray(val)) return [];
    return val.map((v: any) => v['en-US'] || v['ru'] || '').filter(Boolean);
  };

  const catId = product.categories?.[0]?.id;
  const slug = product.slug?.['en-US'] || '';

  return {
    id: product.id,
    productType: catId && categories[catId] ? categories[catId] : 'Unknown',
    name: product.name?.['en-US'] || '',
    description: product.description?.['en-US'] || '',
    price: getVal('price-per-ounce') || 0,
    currency: product.masterVariant.prices?.[0]?.value?.currencyCode || 'USD',
    images: product.masterVariant.images?.map(
      (img: { url: string }) => `${img.url}?w=800&h=800&fit=crop&format=webp&q=80`,
    ) || ['https://via.placeholder.com/150'],
    weight: 'ounce',
    flavor: getList('flavor'),
    origin: getVal('origin')?.['en-US'] || '',
    hasCaffeine: !getVal('caffeine-free'),
    ingredients: getList('ingredients'),
    slug,
  };
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

  return response.body.results.map((product: ProductProjection) => mapProduct(product, categories));
};

export const searchProducts = async (
  query: string,
  categories: Record<string, string>,
): Promise<Product[]> => {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          // fuzzy: true,
          limit: 20,
          [`text.en-US`]: `*${query}*`,
          expand: ['masterVariant', 'categories[*]', 'name'],
        },
      })
      .execute();

    return response.body.results.map((product: ProductProjection) =>
      mapProduct(product, categories),
    );
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
