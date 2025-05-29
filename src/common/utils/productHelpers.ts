import type { Attribute, ProductProjection } from '@commercetools/platform-sdk';
import {
  AttributeMapper,
  type TeaAttributes,
  type TeawareAttributes,
  type ValueType,
} from '../types/product-types';

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

const mapTeawareAttributes: AttributeMapper<TeawareAttributes> = (product) => {
  const attributes = product.masterVariant.attributes || [];
  const prices = product.masterVariant.prices || [];
  const name = product.name['en-US'];
  const description = product.description?.['en-US'] || '';
  const images = product.masterVariant.images?.map((img) => img.url) || [];
  const price = prices[0]?.value?.centAmount / 100 || 0;
  const material = getAttrValue(attributes, 'material')?.['en-US'] || '';
  const volume = getAttrValue(attributes, 'volume') || 0;
  const teawareType = getAttrValue(attributes, 'teaware-type')?.['en-US'] || '';

  return {
    name,
    description,
    images,
    price,
    material,
    volume,
    teawareType,
  };
};

const getDefaultAttributes = (category: string): TeaAttributes | TeawareAttributes => {
  if (category === 'teaware') {
    return {
      name: '',
      description: '',
      images: [],
      price: 0,
      material: '',
      volume: 0,
      teawareType: '',
    };
  }

  return {
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
  };
};

export const extractProductAttributes = (
  category: string,
  product?: ProductProjection,
): TeaAttributes | TeawareAttributes => {
  if (
    !product ||
    !product.description ||
    !product.masterVariant.attributes ||
    !product.masterVariant.prices
  ) {
    return getDefaultAttributes(category);
  }

  if (category === 'teaware') {
    return mapTeawareAttributes(product);
  } else {
    return mapTeaAttributes(product);
  }
};
