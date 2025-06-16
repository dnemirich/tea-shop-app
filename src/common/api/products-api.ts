import { apiRoot } from '@/common/config/api-client.ts';

export const getProducts = () => {
  //return apiRoot.products().get().execute();
  return apiRoot.productProjections().get().execute();
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

export const getCartDiscounts = () => {
  return apiRoot.cartDiscounts().get().execute();
};

export const getDiscountCodes = async () => {
  const response = await apiRoot
    .discountCodes()
    .get({
      queryArgs: {
        where: 'isActive=true',
        limit: 100,
      },
    })
    .execute();

  return response.body.results;
};

export const checkDiscountCode = (code: string) => {
  return apiRoot
    .discountCodes()
    .get({
      queryArgs: {
        where: `code="${code}"`,
      },
    })
    .execute();
};
