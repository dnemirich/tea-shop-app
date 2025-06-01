import { useUserStore } from '@/common/store/user-store';
import s from './Addresses.module.scss';
import { HousePlus } from 'lucide-react';
import { AddressCard } from './AddressCard/AddressCard';
import { Address } from '@/common/types/user-types';
import { useState } from 'react';
import { AddressForm } from './AddressForm/AddressForm';

export const Addresses: React.FC = () => {
  const addresses = useUserStore((state) => state.addresses);
  const defaultShippingId = useUserStore((state) => state.defaultShippingAddress);
  const defaultBillingId = useUserStore((state) => state.defaultBillingAddress);
  const updateUserInfo = useUserStore((state) => state.updateUserInfo);

  const [editingAddress, setEditingAddress] = useState<null | Address>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const deleteAddress = (id: string) => {
    const updated = addresses?.filter((addr) => addr.id !== id) || [];
    updateUserInfo({ addresses: updated });
    // TODO: call API to sync
  };

  const setDefaultAddress = (id: string, type: 'shipping' | 'billing') => {
    if (type === 'shipping') updateUserInfo({ defaultShippingAddress: id });
    if (type === 'billing') updateUserInfo({ defaultBillingAddress: id });
    // TODO: call API to sync
  };

  const handleSubmit = (address: Address) => {
    if (addresses) {
      const exists = addresses.some((a) => a.id === address.id);
      const updated = exists
        ? addresses.map((a) => (a.id === address.id ? address : a))
        : [...addresses, address];
      updateUserInfo({ addresses: updated });
      setShowForm(false);
      // TODO: call API to sync
    }
  };

  if (showForm) {
    return (
      <AddressForm
        initialData={editingAddress || {}}
        onSubmit={handleSubmit}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className={s.wrapper}>
      <div className={s.titleWrapper}>
        <h2>Address book</h2>
        <HousePlus className={s.icon} size={16} onClick={handleAdd} />
      </div>
      <div className={s.addressesWrapper}>
        {addresses &&
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefaultShipping={address.id === defaultShippingId}
              isDefaultBilling={address.id === defaultBillingId}
              onEdit={handleEdit}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
      </div>
    </div>
  );
};
