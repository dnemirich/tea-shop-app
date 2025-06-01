import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Address } from './user-types';

export type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
};

export type AuthService = {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserInfo>;
  logout: () => void;
  getApiRoot: () => ByProjectKeyRequestBuilder | null;
  restoreSession: () => Promise<ByProjectKeyRequestBuilder | null>;
};
