import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/common/components/Breadcrumbs/Breadcrumbs.tsx';
import { useParams } from 'react-router';
import { getProductBySlug } from '@/features/product/api/product-api.ts';
import { useEffect, useState } from 'react';
import type { ProductProjection } from '@commercetools/platform-sdk';
import Sample from '@/assets/icons/sample-icon.svg';
import Bag50 from '@/assets/icons/bag-50-icon.svg';
import Bag100 from '@/assets/icons/bag-100-icon.svg';
import Bag250 from '@/assets/icons/bag-250-icon.svg';
import Globe from '@/assets/icons/globe-icon.svg';
import { Button } from '@/common/components/Button/Button.tsx';
import { Minus, Plus, ShoppingBasket } from 'lucide-react';
import s from './ProductPage.module.scss';
import { Carousel } from '@/common/components/Carousel/Carousel.tsx';
import { TeaInfoBox } from './TeaInfoBox/TeaInfoBox.tsx';
import { ROUTES } from '@/common/config/routes.ts';

const OUNCE_SIZE = 28.35;
const VARIANTS = [
  {
    title: 'Sample',
    icon: Sample,
    value: 'sample',
  },
  {
    title: '50 g bag',
    icon: Bag50,
    value: '50',
  },
  {
    title: '100 g bag',
    icon: Bag100,
    value: '100',
  },
  {
    title: '250 g bag',
    icon: Bag250,
    value: '250',
  }
]

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  let [productCount, setProductCount] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedValue, setSelectedValue] = useState('sample');

  const category = categoryName?.split('-').join(' ');
  const productName = productSlug?.split('-').join(' ');

  useEffect(() => {
    productSlug &&
      getProductBySlug(productSlug).then((res) => {
        setProduct(res.body.results[0]);
      });
  }, [productSlug]);

  let name = '';
  let origin = '';
  let price = 0;
  let description = '';
  let hasCaffeine = '';
  let servingSize = '';
  let waterTemp = '';
  let steepingTime = '';
  let teaColor = '';
  let flavor: string[] = [];
  let ingredients: string[] = [];
  let images: string[] = [];

  if (product && product.description && product.masterVariant.attributes) {
    const originAttr = product.masterVariant.attributes.find((attr) => attr.name === 'origin');

    if (originAttr) origin = originAttr.value['en-US'];

    const priceAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'price-per-ounce',
    );

    if (priceAttr) price = priceAttr.value;

    const flavorAttr = product.masterVariant.attributes.find((attr) => attr.name === 'flavor');
    if (flavorAttr) flavorAttr.value.map((val) => flavor.push(val['en-US']));

    const servingSizeAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'serving-size',
    );
    if (servingSizeAttr) servingSize = servingSizeAttr.value['en-US'];

    const waterTempAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'water-temperature',
    );
    if (waterTempAttr) waterTemp = waterTempAttr.value + '°C';

    const caffeineAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'caffeine-free',
    );
    if (caffeineAttr) hasCaffeine = caffeineAttr.value ? 'no caffeine' : 'has caffeine';

    const steepingTimeAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'steeping-time',
    );
    if (steepingTimeAttr) steepingTime = steepingTimeAttr.value['en-US'];

    const ingredientsAttr = product.masterVariant.attributes.find(
      (attr) => attr.name === 'ingridients',
    );
    if (ingredientsAttr) ingredientsAttr.value.map((val) => ingredients.push(val['en-US']));

    const teaColorAttr = product.masterVariant.attributes.find((attr) => attr.name === 'color');
    if (teaColorAttr) teaColor = teaColorAttr.value;

    product.masterVariant.images?.map((img) => images.push(img.url));

    name = product?.name['en-US'];
    description = product?.description['en-US'];
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`${ROUTES.HOME}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`${ROUTES.SHOP}`}>Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`${ROUTES.SHOP}/${categoryName}`}>{category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {product && (
        <div className={s.pageContent}>
          <div className={s.upperContent}>
            <Carousel images={images} />
            <div className={s.mainInfo}>
              <h2 className={s.name}>{name}</h2>
              <p className={s.description}>{description}</p>
              <p className={s.origin}>
                <img src={Globe} alt={'globe'} width={24} height={24} />
                Origin: {origin}
              </p>
              <p className={s.price}>
                €{calculatedPrice === 0 ? price : calculatedPrice.toFixed(2)}
              </p>
              <p className={s.variantsHeading}>Variants</p>
              <div role={'radiogroup'} className={s.variants}>
                {VARIANTS.map((variant, index) => (
                  <label className={`${s.variant} ${selectedValue === variant.value ? s.selected : ''}`} key={index}>
                    <input
                      type={'radio'}
                      name={'weight'}
                      value={variant.value}
                      hidden
                      onChange={() => {
                        if (variant.value === 'sample') {
                          setCalculatedPrice(price);
                        } else {
                          setCalculatedPrice((price / OUNCE_SIZE) * Number(variant.value));
                        }
                        setSelectedValue(variant.value);
                      }}
                    />
                    <img src={variant.icon} alt={variant.title} width={50} height={50} />
                    <span>{variant.title}</span>
                  </label>
                ))}
              </div>
              <div>
                <div className={s.counterContainer}>
                  <div className={s.counter}>
                    <Button
                      className={s.counterBtn}
                      onClick={() => (productCount > 0 ? setProductCount((prev) => prev - 1) : 0)}
                    >
                      <Minus />
                    </Button>
                    <span className={s.count}>{productCount}</span>
                    <Button
                      className={s.counterBtn}
                      onClick={() => setProductCount((prev) => prev + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button className={s.btn}>
                    <ShoppingBasket />
                    Add to bag
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {categoryName !== 'teaware' && (
            <TeaInfoBox
              servingSize={servingSize}
              waterTemp={waterTemp}
              steepingTime={steepingTime}
              teaColor={teaColor}
              flavor={flavor}
              hasCaffeine={hasCaffeine}
              ingredients={ingredients}
            />
          )}
        </div>
      )}
    </>
  );
};
