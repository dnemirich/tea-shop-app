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
import Water from '@/assets/icons/water-temp-icon.svg';
import Globe from '@/assets/icons/globe-icon.svg';
import Kettle from '@/assets/icons/kettle-icon.svg';
import Timer from '@/assets/icons/timer-icon.svg';
import { Button } from '@/common/components/Button/Button.tsx';
import { Minus, Plus } from 'lucide-react';
import s from './ProductPage.module.scss';
import { Carousel } from '@/common/components/Carousel/Carousel.tsx';

export const ProductPage = () => {
  const { categoryName, productSlug } = useParams();
  const [product, setProduct] = useState<ProductProjection>();
  let [productCount, setProductCount] = useState(0);

  const category = categoryName?.split('-').join(' ');
  const productName = productSlug?.split('-').join(' ');

  // getProducts().then(res => console.log(res));

  useEffect(() => {
    productSlug &&
      getProductBySlug(productSlug).then((res) => {
        console.log(res.body.results[0]);
        setProduct(res.body.results[0]);
      });
  }, [productSlug]);

  let name = '';
  let origin = '';
  let description = '';
  let price = 0;
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
    if (caffeineAttr) hasCaffeine = caffeineAttr.value ? 'No caffeine' : 'Has caffeine';

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
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shop/${categoryName}`}>{category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {product && (
        <>
          <div>
            <Carousel images={images} />
            <div>
              <h2>{name}</h2>
              <p>{description}</p>
              <p>
                <img src={Globe} alt={'globe'} width={24} height={24} />
                Origin:{origin}
              </p>
              <p>Euro: €{price}</p>
              <p>Variants:</p>
              <div role={'radiogroup'}>
                <label>
                  <input type={'radio'} name={'weight'} value={'sample'} hidden />
                  <img src={Sample} alt={'Sample'} width={50} height={50} />
                  <span>Sample</span>
                </label>
                <label>
                  <input type={'radio'} name={'weight'} value={'50'} hidden />
                  <img src={Bag50} alt={'Bag 50'} width={50} height={50} />
                  <span>50 g bag</span>
                </label>
                <label>
                  <input type={'radio'} name={'weight'} value={'100'} hidden />
                  <img src={Bag100} alt={'Bag 100'} width={50} height={50} />
                  <span>100 g bag</span>
                </label>
                <label>
                  <input type={'radio'} name={'weight'} value={'250'} hidden />
                  <img src={Bag250} alt={'Bag 250'} width={50} height={50} />
                  <span>250 g bag</span>
                </label>
              </div>
              <div>
                <div>
                  <Button
                    className={s.counterBtn}
                    onClick={() => (productCount > 0 ? setProductCount((prev) => prev - 1) : 0)}
                  >
                    <Minus />
                  </Button>
                  <span>{productCount}</span>
                  <Button
                    className={s.counterBtn}
                    onClick={() => setProductCount((prev) => prev + 1)}
                  >
                    <Plus />
                  </Button>
                  <Button className={s.btn}>Add to bag</Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <h3>Steeping instructions</h3>
              <ul>
                <li>
                  <img src={Kettle} alt={'Kettle'} width={24} height={24} />
                  <span>Serving size</span>
                  <span>{servingSize}</span>
                </li>
                <li>
                  <img src={Water} alt={'water temp'} width={24} height={24} />
                  <span>Water temperature</span>
                  <span>{waterTemp}</span>
                </li>
                <li>
                  <img src={Timer} alt={'Timer'} width={24} height={24} />
                  <span>Steeping time</span>
                  <span>{steepingTime}</span>
                </li>
                <li>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: teaColor,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                    }}
                  ></span>
                  <span>Tea color</span>
                </li>
              </ul>
            </div>
            <div>
              <h3>About this tea</h3>
              <div>
                <div>
                  <h4>Flavor</h4>
                  <p>{flavor.join(', ')}</p>
                </div>
                <div>
                  <h4>Caffeine</h4>
                  <p>{hasCaffeine}</p>
                </div>
              </div>
              <h3>Ingredients</h3>
              <p>{ingredients.join(', ')}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
