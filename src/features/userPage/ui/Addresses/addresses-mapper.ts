import type { Address as SdkAddress } from '@commercetools/platform-sdk';
import type { Address } from '@/common/types/user-types';
import { Countries } from '@/common/types/user-types';

export const mapSdkAddress = (sdk: SdkAddress): Address => ({
  country: sdk.country as Countries,
  city: sdk.city ?? '',
  streetName: sdk.streetName ?? '',
  streetNumber: sdk.streetNumber ?? '',
  postalCode: sdk.postalCode ?? '',
  id: sdk.id ?? '',
});

export const mapSdkAddresses = (addresses: SdkAddress[] = []): Address[] =>
  addresses.map(mapSdkAddress);
