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
          <p>Country: {address.country}</p>
          <p>City: {address.city}</p>
          <p>
            Street: {address.streetName} {address.streetNumber}
          </p>
          <p>Postal code: {address.postalCode}</p>
        </div>
      ))}
    </div>
  );
};
