import { apiRoot } from '@/common/config/api-client.ts';

export const getProducts = () => {
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
