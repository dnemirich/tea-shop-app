import type { RegistrationCustomer } from '@/common/types/user-types.ts';
import { apiRoot } from '@/common/config/api-client.ts';

export const createCustomer = (customerData: RegistrationCustomer) => {
  return apiRoot
    .me()
    .signup()
    .post({ body: customerData })
    .execute()
    .then((res) => res.body);
};
