import type { Attribute, ProductProjection } from '@commercetools/platform-sdk';
import { AttributeMapper, type TeaAttributes, type ValueType } from '../types/product-types';

const getAttrValue = (attributes: Attribute[], name: string) =>
  attributes.find((attr) => attr.name === name)?.value;

const mapTeaAttributes: AttributeMapper<TeaAttributes> = (product) => {
  const attributes = product.masterVariant.attributes || [];
  const name = product.name['en-US'];
  const description = product.description?.['en-US'] || '';
  const images = product.masterVariant.images?.map((img) => img.url) || [];
  const price = getAttrValue(attributes, 'price-per-ounce') || 0;
  const origin = getAttrValue(attributes, 'origin')?.['en-US'] || '';
  const flavor = getAttrValue(attributes, 'flavor')?.map((val: ValueType) => val['en-US']) || [];
  const servingSize = getAttrValue(attributes, 'serving-size')?.['en-US'] || '';
  const waterTemp = (getAttrValue(attributes, 'water-temperature') || '') + '°C';
  const hasCaffeine = getAttrValue(attributes, 'caffeine-free') ? 'no caffeine' : 'has caffeine';
  const steepingTime = getAttrValue(attributes, 'steeping-time')?.['en-US'] || '';
  const teaColor = getAttrValue(attributes, 'color') || '';
  const ingredients =
    getAttrValue(attributes, 'ingridients')?.map((val: ValueType) => val['en-US']) || [];

  return {
    name,
    description,
    images,
    price,
    origin,
    flavor,
    hasCaffeine,
    servingSize,
    waterTemp,
    steepingTime,
    teaColor,
    ingredients,
  };
};

const getDefaultAttributes = (): TeaAttributes => ({
  name: '',
  description: '',
  images: [],
  origin: '',
  price: 0,
  flavor: [],
  hasCaffeine: '',
  servingSize: '',
  waterTemp: '',
  steepingTime: '',
  teaColor: '',
  ingredients: [],
});

export const extractProductAttributes = (product?: ProductProjection): TeaAttributes => {
  if (
    !product ||
    !product.description ||
    !product.masterVariant.attributes ||
    !product.masterVariant.prices
  ) {
    return getDefaultAttributes();
  }

  return mapTeaAttributes(product);
};
