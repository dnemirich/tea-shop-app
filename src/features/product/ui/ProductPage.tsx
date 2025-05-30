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

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  const [calculatedPrice, setCalculatedPrice] = useState(0);

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
  }, [categoryName, productSlug]);

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
              <h2 className={s.name}>{productAttributes.name}</h2>
              <p className={s.description}>{productAttributes.description}</p>
              <p className={s.property}>
                <img src={Globe} alt={'globe'} width={24} height={24} />
                Origin: {productAttributes.origin}
              </p>
              <p className={s.price}>
                €{calculatedPrice === 0 ? productAttributes.price : calculatedPrice.toFixed(2)}
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
