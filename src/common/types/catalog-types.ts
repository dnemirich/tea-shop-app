export type Product = {
  id: string;
  productType: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  weight?: string;
  flavor?: string[];
  origin?: string;
  hasCaffeine?: boolean;
  ingredients?: string[];
  slug: string;
  productId: string;
};

export type DiscontPrice = {
  originalPrice: number;
  discountedPrice?: number;
};

export type LocalizedString = {
  [locale: string]: string;
};

export type Attribute = {
  name: string;
  value: any;
};

export type CategoryReference = {
  id: string;
};

export type Image = {
  url: string;
};

export type Price = {
  value: {
    currencyCode: string;
  };
};

// API
export type Category = {
  id: string;
  name: {
    [locale: string]: string;
  };
};

export type ProductProjection = {
  id: string;
  name: {
    [locale: string]: string;
  };
  description?: {
    [locale: string]: string;
  };
  categories?: { id: string }[];
  masterVariant: {
    attributes?: { name: string; value: any }[];
    prices?: { value: { currencyCode: string } }[];
    images?: { url: string }[];
  };
  slug: {
    [locale: string]: string;
  };
};
