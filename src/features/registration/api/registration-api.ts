import type { Customer } from '@/common/types/user-types.ts';
import { apiRoot } from '@/common/config/api-client.ts';

export const createCustomer = (customerData: Customer) => {
  return apiRoot
    .me()
    .signup()
    .post({ body: customerData })
    .execute()
    .then((res) => res.body);
};
