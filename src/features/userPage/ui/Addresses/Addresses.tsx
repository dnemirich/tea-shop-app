import { useUserStore } from '@/common/store/user-store';
import s from './Addresses.module.scss';
import { Pencil } from 'lucide-react';

export const Addresses: React.FC = () => {
  const addresses = useUserStore((state) => state.addresses);
  console.log(addresses);
  const defaultShippingId = useUserStore((state) => state.defaultShippingAddress);
  const defaultBillingId = useUserStore((state) => state.defaultBillingAddress);

  if (!addresses || addresses.length === 0) {
    return <p className={s.emptyMessage}>Not found addresses</p>;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.titleWrapper}>
        <h2>Address book</h2>
        <Pencil size={16} className={s.icon} />
      </div>
      <div className={s.addressesWrapper}>
        {addresses.map((address, id) => (
          <div key={id} className={`${s.addressCard}`}>
            {(address.id === defaultShippingId || address.id === defaultBillingId) && (
              <span className={s.default}>
                {address.id === defaultShippingId && 'Default Shipping address'}
                {address.id === defaultBillingId && 'Default Billing address'}
              </span>
            )}

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
              <span>Postal code</span>
              <p>{address.postalCode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
