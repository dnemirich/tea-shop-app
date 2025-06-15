/*import { RegistrationPage } from '@/features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import s from './App.module.scss';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/common/components/Layout/Layout';

import { LoginPage } from '@/features/login/ui/LoginPage/LoginPage.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { NotFoundPage } from '@/common/components/NotFoundPage/NotFoundPage.tsx';
import { UserPage } from '@/features/userPage/ui/UserPage.tsx';
import { HomePage } from '@/features/home/ui/HomePage.tsx';
import { ProductPage } from '@/features/product/ui/ProductPage.tsx';
import { authService } from '@/features/login/api/authService';
import { CatalogPage } from '@/features/catalog/ui/CatalogPage/CatalogPage';
import { useDiscountStore } from '@/common/store/discount-store.ts';
import { getDiscountsInfo } from '@/common/utils/discountHelpers.ts';
import { BasketPage } from '@/features/basket/ui/BasketPage/BasketPage';

function App() {
  const { error, clearError, success, clearSuccess } = useAppStore();
  const { setHasActiveDiscount, setDiscount } = useDiscountStore();

  useEffect(() => {
    getDiscountsInfo().then((discountInfo) => {
      setHasActiveDiscount(true);
      setDiscount(discountInfo);
    });
  }, [setDiscount, setHasActiveDiscount]);

  useEffect(() => {
    authService.restoreSession();
  });

  useEffect(() => {
    if (error) {
      toast.error(error, {
        className: s.notification,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      toast.error(success, {
        className: s.success,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearSuccess();
    }
  }, [success, clearSuccess]);

  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route path={ROUTES.USER} element={<UserPage />} />
          <Route path={`${ROUTES.SHOP}/:categoryName/:productSlug`} element={<ProductPage />} />
          <Route index element={<HomePage />} />
          <Route path={ROUTES.BASKET} element={<BasketPage />} />

          {/* <Route path="about" element={<About />} /> */
/*<Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path={ROUTES.SHOP} element={<CatalogPage />} />
          <Route path={`${ROUTES.SHOP}/:categoryName`} element={<CatalogPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;*/

//мое

import { RegistrationPage } from '@/features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import s from './App.module.scss';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/common/components/Layout/Layout';

import { LoginPage } from '@/features/login/ui/LoginPage/LoginPage.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { NotFoundPage } from '@/common/components/NotFoundPage/NotFoundPage.tsx';
import { UserPage } from '@/features/userPage/ui/UserPage.tsx';
import { HomePage } from '@/features/home/ui/HomePage.tsx';
import { ProductPage } from '@/features/product/ui/ProductPage.tsx';
import { authService } from '@/features/login/api/authService';
import { CatalogPage } from '@/features/catalog/ui/CatalogPage/CatalogPage';
import { useDiscountStore } from '@/common/store/discount-store.ts';
import { getDiscountsInfo } from '@/common/utils/discountHelpers.ts';
import { useUserStore } from '@/common/store/user-store';
import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { BasketPage } from '@/features/basket/ui/BasketPage/BasketPage';
import { useCartStore } from '@/common/store/cart-store';

function App() {
  const { error, clearError, success, clearSuccess } = useAppStore();
  const { setHasActiveDiscount, setDiscount } = useDiscountStore();
  const { initializeCart } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  //корзина анонима
  useEffect(() => {
    if (!useUserStore.getState().isLoggedIn) {
      let anonymousId = localStorage.getItem('anonymousId');

      if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        localStorage.setItem('anonymousId', anonymousId);
      }

      //корзина с anonymousId
      anonymousApiRoot
        .carts()
        .get({
          queryArgs: {
            where: `anonymousId="${anonymousId}"`,
          },
        })
        .execute()
        .then((response) => {
          console.log('Cart search results:', response.body.results);
          if (response.body.results.length === 0) {
            //попробуем с новым anonymousId, если ошибка дублирования
            const newAnonymousId = crypto.randomUUID();
            console.log('Creating new cart with anonymousId:', newAnonymousId);
            localStorage.setItem('anonymousId', newAnonymousId);
            return anonymousApiRoot
              .carts()
              .post({
                body: {
                  currency: 'EUR',
                  anonymousId: newAnonymousId,
                  priceMode: 'ExternalPrice',
                } as any,
              })
              .execute();
          }
        })
        .catch((error) => {
          if (error?.message?.includes('anonymousId is already in use')) {
            localStorage.removeItem('anonymousId');
            location.reload();
          } else if (error.statusCode === 400) {
            console.log('Check client credentials and scopes:', error);
            if (error.body?.errors) {
              console.log(error.body.errors);
            }
          } else {
            console.log('Failed to create cart', error);
          }
        });
    }
  }, []);

  useEffect(() => {
    getDiscountsInfo().then((discountInfo) => {
      setHasActiveDiscount(true);
      setDiscount(discountInfo);
    });
  }, [setDiscount, setHasActiveDiscount]);

  useEffect(() => {
    async function restore() {
      await authService.restoreSession();
    }
    restore();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        className: s.notification,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      toast.success(success, {
        className: s.success,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearSuccess();
    }
  }, [success, clearSuccess]);

  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route path={ROUTES.USER} element={<UserPage />} />
          <Route path={`${ROUTES.SHOP}/:categoryName/:productSlug`} element={<ProductPage />} />
          <Route index element={<HomePage />} />
          <Route path={ROUTES.CART} element={<BasketPage />} />

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path={ROUTES.SHOP} element={<CatalogPage />} />
          <Route path={`${ROUTES.SHOP}/:categoryName`} element={<CatalogPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
