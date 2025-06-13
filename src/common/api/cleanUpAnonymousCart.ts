import { anonymousApiRoot } from '@/features/login/api/anonymous-client';

export const cleanUpAnonymousCart = async () => {
  const anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    console.log('No anonymousId found, nothing to clean');
    return;
  }

  try {
    //сначала получаем анонимную корзину
    let anonymousCart;
    try {
      const response = await anonymousApiRoot
        .carts()
        .get({
          queryArgs: {
            where: `anonymousId="${anonymousId}"`,
            limit: 1,
          },
        })
        .execute();

      if (response.body.results.length === 0) {
        console.log('No anonymous cart found for cleaning');
        localStorage.removeItem('anonymousId');
        return;
      }

      anonymousCart = response.body.results[0];
    } catch (error: any) {
      if (error.statusCode === 401) {
        console.warn('Unauthorized: anonymous token expired or invalid');
        localStorage.removeItem('anonymousId');
        return;
      }

      if (
        error.code === 'invalid_request' &&
        error.message.includes('anonymousId is already in use')
      ) {
        console.log('Anonymous session already invalidated');
        localStorage.removeItem('anonymousId');
        return;
      }

      console.log('Error fetching anonymous cart:', error);
      return;
    }

    //удаляем все товары из корзины если есть
    if (anonymousCart.lineItems.length > 0) {
      console.log(`Removing ${anonymousCart.lineItems.length} items from anonymous cart`);
      const removeActions = anonymousCart.lineItems.map((item) => ({
        action: 'removeLineItem' as const,
        lineItemId: item.id,
      }));

      try {
        await anonymousApiRoot
          .carts()
          .withId({ ID: anonymousCart.id })
          .post({
            body: {
              version: anonymousCart.version,
              actions: removeActions,
            },
          })
          .execute();
      } catch (error) {
        console.log('Error removing items from cart:', error);
      }
    }

    //удаляем саму корзину
    try {
      await anonymousApiRoot
        .carts()
        .withId({ ID: anonymousCart.id })
        .delete({
          queryArgs: {
            version: anonymousCart.version,
          },
        })
        .execute();
      console.log('Anonymous cart deleted successfully');
    } catch (error) {
      console.log('Error deleting anonymous cart:', error);
    }

    //очищаем анонимный ID
    localStorage.removeItem('anonymousId');
    console.log('Anonymous session cleaned up');
  } catch (error) {
    console.log('Unexpected error during anonymous cart cleanup:', error);
  }
};
