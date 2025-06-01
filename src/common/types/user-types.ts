export type Address = {
  country: Countries;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
};

export type Customer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};

export enum Countries {
  Belarus = 'BY',
  Russia = 'RU',
  Kazakhstan = 'KZ',
  Armenia = 'AM',
  Uzbekistan = 'UZ',
}
