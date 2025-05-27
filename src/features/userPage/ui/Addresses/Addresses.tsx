import { useUserStore } from '@/common/store/user-store';
import s from './Addresses.module.scss';

export const Addresses: React.FC = () => {
  const addresses = useUserStore((state) => state.addresses);

  if (!addresses || addresses.length === 0) {
    return <p className={s.emptyMessage}>Not found addresses</p>;
  }

  return (
    <div className={s.addressesWrapper}>
      {addresses.map((address, index) => (
        <div key={index} className={s.addressCard}>
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
  );
};
