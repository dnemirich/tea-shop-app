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
import type { TeaAttributes } from '@/common/types/product-types.ts';

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [discountSize, setDiscountSize] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>('sample');
  const [quantity, setQuantity] = useState(1);
  const [productAttributes, setProductAttributes] = useState<TeaAttributes | null>(null);
  const { discount } = useDiscountStore();
  const { addItem, removeItem, cart } = useCartStore();
  const cartItems = cart?.lineItems || [];

  const isInCart = cartItems.some((item) => {
    return (
      item.productId === product?.id &&
      item.custom?.fields.selectedWeightVariant === selectedVariant
    );
  });

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
          if (fetchedProduct) {
            const attrs = extractProductAttributes(fetchedProduct);
            setProductAttributes(attrs);
            setCalculatedPrice(attrs.price);
          }
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }

    if (categoryName && discount) {
      if (discount.isActive && discount.references.includes(categoryName)) {
        setDiscountSize(discount.value);
      }
    }
  }, [categoryName, productSlug, discount]);

  const onVariantChange = (price: number, selectedWeightVariant?: string) => {
    setCalculatedPrice(price);
    if (!selectedWeightVariant) return;
    setSelectedVariant(selectedWeightVariant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!product) {
      console.log('Cannot add to cart - product not loaded');
      return;
    }

    const discountedPrice =
      discountSize > 0 ? (calculatedPrice * (100 - discountSize)) / 100 : calculatedPrice;

    console.log(discountedPrice);
    try {
      await addItem(product.id, product.masterVariant?.id || 1, quantity, selectedVariant, {
        currencyCode: 'EUR',
        centAmount: Math.round(discountedPrice * 100),
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!product) {
      console.log('Cannot add to cart - product not loaded');
      return;
    }

    const item = cartItems.find((item) => {
      return (
        item.productId === product?.id &&
        item.custom?.fields.selectedWeightVariant === selectedVariant
      );
    });

    if (!item) return;

    try {
      await removeItem(item?.id, item?.quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
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
                <Button
                  className={`${s.btn} ${isInCart ? s.removeBtn : ''}`}
                  onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                >
                  <ShoppingBasket />
                  {isInCart ? 'Remove from cart' : 'Add to cart'}
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
