import React from 'react';
import s from './AddressCars.module.scss';
import { Pencil, Trash2 } from 'lucide-react';
import { Address } from '@/common/types/user-types';
import { Checkbox } from '@/common/components/Checkbox/Checkbox';

type Props = {
  address: Address;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string, type: 'shipping' | 'billing') => void;
};

export const AddressCard: React.FC<Props> = ({
  address,
  isDefaultShipping,
  isDefaultBilling,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div className={s.addressCard}>
      <div className={s.defaultWrapper}>
        {(isDefaultShipping || isDefaultBilling) && (
          <span className={s.default}>
            {isDefaultShipping && 'Default Shipping Address'}
            {isDefaultBilling && 'Default Billing Address'}
          </span>
        )}
      </div>

      <div className={s.fields}>
        <div className={s.info}>
          <span>Country</span>
          <p>{address.country}</p>
        </div>
        <div className={s.info}>
          <span>City</span>
          <p>{address.city}</p>
        </div>
        <div className={s.info}>
          <span>Street</span>
          <p>
            {address.streetName} {address.streetNumber}
          </p>
        </div>
        <div className={s.info}>
          <span>Postal Code</span>
          <p>{address.postalCode}</p>
        </div>
      </div>

      <div className={s.actions}>
        <div className={s.buttons}>
          <Pencil className={s.icon} size={18} onClick={() => onEdit(address)} />
          <Trash2 className={s.icon} size={18} onClick={() => onDelete(address.id)} />
        </div>
        <div className={s.checkboxWrapper}>
          {!isDefaultShipping && (
            <Checkbox
              className={s.checkbox}
              onChange={() => onSetDefault(address.id, 'shipping')}
              label="Set as default shipping address"
            />
          )}
          {!isDefaultBilling && (
            <Checkbox
              className={s.checkbox}
              onChange={() => onSetDefault(address.id, 'billing')}
              label="Set as default billing address"
            />
          )}
        </div>
      </div>
    </div>
  );
};
