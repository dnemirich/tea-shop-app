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
import { Button } from '@/common/components/Button/Button.tsx';
import { useCartStore } from '@/common/store/cart-store.ts';
import { ShoppingBasket } from 'lucide-react';

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [discountSize, setDiscountSize] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>('sample');
  const [quantity, setQuantity] = useState(1);
  const { discount } = useDiscountStore();
  const { addItem } = useCartStore();

  const category = categoryName?.split('-').join(' ');
  const productName = productSlug?.split('-').join(' ');

  const breadcrumbs = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Shop', path: ROUTES.SHOP },
    { name: category, path: `${ROUTES.SHOP}/${categoryName}` },
    { name: productName },
  ];

  useEffect(() => {
    if (productSlug) {
      getProductBySlug(productSlug)
        .then((res) => {
          const fetchedProduct = res.body.results[0];
          setProduct(fetchedProduct);

          if (
            fetchedProduct &&
            fetchedProduct.masterVariant &&
            fetchedProduct.masterVariant.prices?.length
          ) {
            const priceInCents = fetchedProduct.masterVariant.prices[0].value.centAmount;
            setCalculatedPrice(priceInCents / 100);
            console.log('Product price set to:', priceInCents / 100);
          }
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }

    if (categoryName && discount) {
      if (discount.isActive && discount.references.includes(categoryName)) {
        setDiscountSize(discount.value);
        console.log('Discount applied:', discount.value);
      }
    }
  }, [categoryName, productSlug, discount]);

  const productAttributes = product && extractProductAttributes(product);

  const onVariantChange = (price: number, selectedWeightVariant?: string) => {
    setCalculatedPrice(price);
    setSelectedVariant(selectedWeightVariant);
  };

  const handleAddToCart = async () => {
    if (!product) {
      console.log('Cannot add to cart - product not loaded');
      return;
    }

    const discountedPrice =
      discountSize > 0 ? (calculatedPrice * (100 - discountSize)) / 100 : calculatedPrice;

    try {
      await addItem(product.id, product.masterVariant?.id || 1, quantity, selectedVariant, {
        currencyCode: 'EUR',
        centAmount: Math.round(discountedPrice * 100),
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
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
              <div className={s.counterContainer}>
                <ProductCounter quantity={quantity} setQuantity={setQuantity} />
                <Button className={s.btn} onClick={handleAddToCart}>
                  <ShoppingBasket />
                  Add to Cart
                </Button>
              </div>
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
