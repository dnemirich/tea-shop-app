import { apiRoot } from '@/common/config/api-client.ts';

export const getProducts = () => {
  return apiRoot.products().get().execute();
};

export const getProductBySlug = (slug: string) => {
  return apiRoot
    .productProjections()
    .get({
      queryArgs: {
        where: `slug(en-US="${slug}")`,
      },
    })
    .execute();
};

export const getCategoryById = (ID: string) => {
  return apiRoot.categories().withId({ ID }).get().execute();
};

export const getDiscounts = () => {
  return apiRoot.productDiscounts().get().execute();
};
