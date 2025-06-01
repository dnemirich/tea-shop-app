import { useUserStore } from '@/common/store/user-store';
import s from './Addresses.module.scss';
import { HousePlus } from 'lucide-react';
import { AddressCard } from './AddressCard/AddressCard';
import { Address } from '@/common/types/user-types';
import { useState } from 'react';
import { AddressForm } from './AddressForm/AddressForm';
import { updateCustomer } from '../../api/user-api';

export const Addresses: React.FC = () => {
  const addresses = useUserStore((state) => state.addresses);
  const defaultShippingId = useUserStore((state) => state.defaultShippingAddress);
  const defaultBillingId = useUserStore((state) => state.defaultBillingAddress);

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

  const deleteAddress = async (id: string) => {
    const { email, password, addresses } = useUserStore.getState();
    if (!email || !password || !addresses) return;

    const updatedAddresses = addresses.filter((a) => a.id !== id);

    try {
      await updateCustomer({ addresses: updatedAddresses }, email, password);
      useUserStore.getState().updateUserInfo({ addresses: updatedAddresses });
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const setDefaultAddress = async (id: string, type: 'shipping' | 'billing') => {
    const { email, password } = useUserStore.getState();
    if (!email || !password) return;

    const payload =
      type === 'shipping' ? { defaultShippingAddress: id } : { defaultBillingAddress: id };

    try {
      await updateCustomer(payload, email, password);
      useUserStore.getState().updateUserInfo(payload);
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const handleSubmit = async (address: Address) => {
    const { email, password, addresses } = useUserStore.getState();

    if (!email || !password) return;

    const exists = addresses?.some((a) => a.id === address.id);
    const updatedAddresses =
      exists && addresses
        ? addresses.map((a) => (a.id === address.id ? address : a))
        : [...(addresses || []), address];

    try {
      await updateCustomer({ addresses: updatedAddresses }, email, password);

      useUserStore.getState().updateUserInfo({ addresses: updatedAddresses });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  if (showForm) {
    return (
      <div className={s.wrapper}>
        <div className={s.titleWrapper}>
          <h2>Edit </h2>
        </div>
        <AddressForm
          initialData={editingAddress || {}}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <div className={s.titleWrapper}>
        <h2>Address book</h2>
        <HousePlus className={s.icon} size={18} onClick={handleAdd} />
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
