import { Address } from '@/common/types/user-types';
import { createCustomerApiRoot } from '@/features/login/api/password-flow-client';
import {
  MyCustomerSetDateOfBirthAction,
  MyCustomerSetFirstNameAction,
  MyCustomerSetLastNameAction,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';

export type UpdateCustomerData = Partial<{
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress: string;
  defaultBillingAddress: string;
}>;

export const updateCustomer = async (
  userData: UpdateCustomerData,
  email: string,
  password: string,
) => {
  const apiRoot = createCustomerApiRoot(email, password);

  const currentCustomer = await apiRoot.me().get().execute();
  const version = await currentCustomer.body.version;

  const actions: MyCustomerUpdateAction[] = [];

  if (userData.firstName) {
    actions.push({
      action: 'setFirstName',
      firstName: userData.firstName,
    } as MyCustomerSetFirstNameAction);
  }

  if (userData.lastName) {
    actions.push({
      action: 'setLastName',
      lastName: userData.lastName,
    } as MyCustomerSetLastNameAction);
  }

  if (userData.dateOfBirth) {
    actions.push({
      action: 'setDateOfBirth',
      dateOfBirth: userData.dateOfBirth,
    } as MyCustomerSetDateOfBirthAction);
  }

  if (userData.addresses) {
    currentCustomer.body.addresses?.forEach((address) => {
      actions.push({
        action: 'removeAddress',
        addressId: address.id,
      });
    });

    userData.addresses.forEach((address) => {
      actions.push({
        action: 'addAddress',
        address: {
          ...address,
        },
      });
    });

    if (userData.defaultShippingAddress) {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: userData.defaultShippingAddress,
      });
    }

    if (userData.defaultBillingAddress) {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: userData.defaultBillingAddress,
      });
    }
  }

  return apiRoot
    .me()
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();
};
