export type Address = {
  country: Countries;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  id: string;
};

export type RegistrationAddress = {
  country: Countries;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
};

export type RegistrationCustomer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: RegistrationAddress[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};

export type Customer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress?: string;
  defaultBillingAddress?: string;
};

export enum Countries {
  Belarus = 'BY',
  Russia = 'RU',
  Kazakhstan = 'KZ',
  Armenia = 'AM',
  Uzbekistan = 'UZ',
}
