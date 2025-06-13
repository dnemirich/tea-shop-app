import { BreadcrumbMenu } from '@/common/components/Breadcrumbs/Breadcrumbs.tsx';
import { useParams } from 'react-router';
import { getProductBySlug } from '@/common/api/products-api.ts';
import { useEffect, useState } from 'react';
import type { ProductProjection } from '@commercetools/platform-sdk';
import Globe from '@/assets/icons/globe-icon.svg';
import s from './ProductPage.module.scss';
import { Carousel } from '@/common/components/Carousel/Carousel.tsx';
import { TeaInfoBox } from './TeaInfoBox/TeaInfoBox.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { extractProductAttributes } from '@/common/utils/productHelpers.ts';
import { VariantSelector } from '@/features/product/ui/VariantSelector/VariantSelector.tsx';
import { ProductCounter } from '@/features/product/ui/ProductCounter/ProductCounter.tsx';
import { useDiscountStore } from '@/common/store/discount-store.ts';

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [discountSize, setDiscountSize] = useState(0);
  const { discount } = useDiscountStore();

  const category = categoryName?.split('-').join(' ');
  const productName = productSlug?.split('-').join(' ');

  const breadcrumbs = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Shop', path: ROUTES.SHOP },
    { name: category, path: `${ROUTES.SHOP}/${categoryName}` },
    { name: productName },
  ];

  useEffect(() => {
    productSlug &&
      getProductBySlug(productSlug).then((res) => {
        const fetchedProduct = res.body.results[0];
        setProduct(fetchedProduct);
      });

    if (categoryName && discount) {
      if (discount.isActive && discount.references.includes(categoryName)) {
        setDiscountSize(discount.value);
      }
    }
  }, [categoryName, productSlug, discount]);

  const productAttributes = product && extractProductAttributes(product);

  const onVariantChange = (price: number) => {
    setCalculatedPrice(price);
  };

  return (
    <>
      <BreadcrumbMenu links={breadcrumbs} />
      {product && productAttributes && (
        <div className={s.pageContent}>
          <div className={s.upperContent}>
            <Carousel images={productAttributes.images} />
            <div className={s.mainInfo}>
              {discountSize > 0 && <p className={s.discountLabel}>summer sale</p>}
              <h2 className={s.name}>{productAttributes.name}</h2>
              <p className={s.description}>{productAttributes.description}</p>
              <p className={s.property}>
                <img src={Globe} alt={'globe'} width={24} height={24} />
                Origin: {productAttributes.origin}
              </p>
              <p className={`${s.price} ${discountSize > 0 ? s.discount : ''}`}>
                <span className={s.oldPrice}>
                  €{calculatedPrice === 0 ? productAttributes.price : calculatedPrice.toFixed(2)}
                </span>
                {discountSize > 0 && (
                  <span>
                    €
                    {calculatedPrice === 0
                      ? ((productAttributes.price * (100 - discountSize)) / 100).toFixed(2)
                      : ((calculatedPrice * (100 - discountSize)) / 100).toFixed(2)}
                  </span>
                )}
              </p>
              <VariantSelector onPriceChange={onVariantChange} price={productAttributes.price} />
              <ProductCounter />
            </div>
          </div>
          <TeaInfoBox
            servingSize={productAttributes.servingSize}
            waterTemp={productAttributes.waterTemp}
            steepingTime={productAttributes.steepingTime}
            teaColor={productAttributes.teaColor}
            flavor={productAttributes.flavor}
            hasCaffeine={productAttributes.hasCaffeine}
            ingredients={productAttributes.ingredients}
          />
        </div>
      )}
    </>
  );
};
/*import { BreadcrumbMenu } from '@/common/components/Breadcrumbs/Breadcrumbs.tsx';
import { useParams } from 'react-router';
import { getProductBySlug } from '@/common/api/products-api.ts';
import { useEffect, useState } from 'react';
import type { ProductProjection } from '@commercetools/platform-sdk';
import Globe from '@/assets/icons/globe-icon.svg';
import s from './ProductPage.module.scss';
import { Carousel } from '@/common/components/Carousel/Carousel.tsx';
import { TeaInfoBox } from './TeaInfoBox/TeaInfoBox.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { extractProductAttributes } from '@/common/utils/productHelpers.ts';
import { VariantSelector } from '@/features/product/ui/VariantSelector/VariantSelector.tsx';
import { ProductCounter } from '@/features/product/ui/ProductCounter/ProductCounter.tsx';
import { useDiscountStore } from '@/common/store/discount-store.ts';
import { useUserStore } from '@/common/store/user-store.ts';
import { addLineItem, getOrCreateCart } from '@/common/api/cart-api.ts';
import { Button } from '@/common/components/Button/Button.tsx';

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [discountSize, setDiscountSize] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>('sample');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any>(null); // Cart type
  const { discount } = useDiscountStore();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const category = categoryName?.split('-').join(' ');
  const productName = productSlug?.split('-').join(' ');

  const breadcrumbs = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Shop', path: ROUTES.SHOP },
    { name: category, path: `${ROUTES.SHOP}/${categoryName}` },
    { name: productName },
  ];

  useEffect(() => {
    productSlug &&
      getProductBySlug(productSlug).then((res) => {
        const fetchedProduct = res.body.results[0];
        setProduct(fetchedProduct);
        //устанавливаем начальную цену
        if (
          fetchedProduct &&
          fetchedProduct.masterVariant &&
          fetchedProduct.masterVariant.prices?.length
        ) {
          const priceInCents = fetchedProduct.masterVariant.prices[0].value.centAmount;
          setCalculatedPrice(priceInCents / 100); //переводим в основную валюту
        }
      });

    if (categoryName && discount) {
      if (discount.isActive && discount.references.includes(categoryName)) {
        setDiscountSize(discount.value);
      }
    }
  }, [categoryName, productSlug, discount]);

  //получаем или создаём корзину при загрузке страницы
  useEffect(() => {
    getOrCreateCart()
      .then((cart) => setCart(cart))
      .catch((e) => console.log('Failed to get or create cart', e));
  }, [isLoggedIn]);

  const productAttributes = product && extractProductAttributes(product);

  const onVariantChange = (price: number, selectedWeightVariant?: string) => {
    setCalculatedPrice(price);
    setSelectedVariant(selectedWeightVariant);
  };

  //обработчик добавления в корзину
  const handleAddToCart = async () => {
    if (!cart || !product) {
      console.log('Cart or product not ready');
      return;
    }

    try {
      const variantId = product.masterVariant?.id || 1;

      const externalPrice = {
        currencyCode: 'EUR',
        centAmount: Math.round(calculatedPrice * 100),
      };

      const updatedCart = await addLineItem(
        cart.id,
        cart.version,
        product.id,
        variantId,
        quantity,
        selectedVariant,
        externalPrice,
      );
      setCart(updatedCart);
      console.log(
        'Cart:',
        updatedCart.lineItems.map((item) => ({
          name: item.name?.en || Object.values(item.name || {})[0] || 'No name',
          quantity: item.quantity,
          variantId: item.variant.id,
          selectedWeight: item.custom?.fields?.selectedWeightVariant || 'n/a',
          price: item.price.value.centAmount / 100 + ' EUR',
        })),
      );

      console.log('Added to cart!');
    } catch (error) {
      console.log('Failed to add item to cart', error);
      console.log('Failed to add item to cart');
    }
  };

  return (
    <>
      <BreadcrumbMenu links={breadcrumbs} />
      {product && productAttributes && (
        <div className={s.pageContent}>
          <div className={s.upperContent}>
            <Carousel images={productAttributes.images} />
            <div className={s.mainInfo}>
              {discountSize > 0 && <p className={s.discountLabel}>summer sale</p>}
              <h2 className={s.name}>{productAttributes.name}</h2>
              <p className={s.description}>{productAttributes.description}</p>
              <p className={s.property}>
                <img src={Globe} alt={'globe'} width={24} height={24} />
                Origin: {productAttributes.origin}
              </p>
              <p className={`${s.price} ${discountSize > 0 ? s.discount : ''}`}>
                <span className={s.oldPrice}>
                  €{calculatedPrice === 0 ? productAttributes.price : calculatedPrice.toFixed(2)}
                </span>
                {discountSize > 0 && (
                  <span>
                    €
                    {calculatedPrice === 0
                      ? ((productAttributes.price * (100 - discountSize)) / 100).toFixed(2)
                      : ((calculatedPrice * (100 - discountSize)) / 100).toFixed(2)}
                  </span>
                )}
              </p>

              <VariantSelector
                price={productAttributes.price}
                onPriceChange={(price, selectedWeightVariant) =>
                  onVariantChange(price, selectedWeightVariant)
                }
              />

              <ProductCounter quantity={quantity} setQuantity={setQuantity} />
              <Button className={s.addToCartBtn} onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
          <TeaInfoBox
            servingSize={productAttributes.servingSize}
            waterTemp={productAttributes.waterTemp}
            steepingTime={productAttributes.steepingTime}
            teaColor={productAttributes.teaColor}
            flavor={productAttributes.flavor}
            hasCaffeine={productAttributes.hasCaffeine}
            ingredients={productAttributes.ingredients}
          />
        </div>
      )}
    </>
  );
};*/
