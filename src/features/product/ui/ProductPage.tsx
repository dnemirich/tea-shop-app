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
import { Minus, Plus, ShoppingBasket } from 'lucide-react';
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
              <p className={s.price}>€{price}</p>
              <p className={s.variantsHeading}>Variants</p>
              <div role={'radiogroup'} className={s.variants}>
                <label className={`${s.variant} ${s.selected}`}>
                  <input type={'radio'} name={'weight'} value={'sample'} hidden />
                  <img src={Sample} alt={'Sample'} width={50} height={50} />
                  <span>Sample</span>
                </label>
                <label className={s.variant}>
                  <input type={'radio'} name={'weight'} value={'50'} hidden />
                  <img src={Bag50} alt={'Bag 50'} width={50} height={50} />
                  <span>50 g bag</span>
                </label>
                <label className={s.variant}>
                  <input type={'radio'} name={'weight'} value={'100'} hidden />
                  <img src={Bag100} alt={'Bag 100'} width={50} height={50} />
                  <span>100 g bag</span>
                </label>
                <label className={s.variant}>
                  <input type={'radio'} name={'weight'} value={'250'} hidden />
                  <img src={Bag250} alt={'Bag 250'} width={50} height={50} />
                  <span>250 g bag</span>
                </label>
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
          <div className={s.lowerContent}>
            <div className={s.leftColumn}>
              <h3 className={s.sectionTitle}>Steeping instructions</h3>
              <ul className={s.attributesList}>
                <li className={s.attributesListItem}>
                  <img src={Kettle} alt={'Kettle'} className={s.imgIcon} />
                  <span className={s.attributeName}>Serving size:</span>
                  <span>{servingSize}</span>
                </li>
                <li className={s.attributesListItem}>
                  <img src={Water} alt={'water temp'} className={s.imgIcon} />
                  <span className={s.attributeName}>Water temperature:</span>
                  <span>{waterTemp}</span>
                </li>
                <li className={s.attributesListItem}>
                  <img src={Timer} alt={'Timer'} className={s.imgIcon} />
                  <span className={s.attributeName}>Steeping time:</span>
                  <span>{steepingTime}</span>
                </li>
                <li className={s.attributesListItem}>
                  <span className={s.teaColor} style={{ backgroundColor: teaColor }}></span>
                  <span className={s.attributeName}>Tea color</span>
                </li>
              </ul>
            </div>
            <div>
              <div className={s.rightColumn}>
                <h3 className={s.sectionTitle}>About this tea</h3>
                <div className={s.qualitiesContainer}>
                  <div className={s.quality}>
                    <h4 className={s.attributeName}>Flavor</h4>
                    <p>{flavor.join(', ')}</p>
                  </div>
                  <div className={s.quality}>
                    <h4 className={s.attributeName}>Caffeine</h4>
                    <p>{hasCaffeine}</p>
                  </div>
                </div>
                <h3 className={s.sectionTitle}>Ingredients</h3>
                <p className={s.ingredientsList}>{ingredients.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
