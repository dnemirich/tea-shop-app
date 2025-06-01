import type { ProductProjection } from '@commercetools/platform-sdk';

export type ProductAttributes = {
  name: string;
  description: string;
  images: string[];
  price: number;
};

export type TeaAttributes = ProductAttributes & {
  origin: string;
  flavor: string[];
  hasCaffeine: string;
  servingSize: string;
  waterTemp: string;
  steepingTime: string;
  teaColor: string;
  ingredients: string[];
};

export type ValueType = {
  ru: string;
  'en-US': string;
};

export type AttributeMapper<T> = (product: ProductProjection) => T;
