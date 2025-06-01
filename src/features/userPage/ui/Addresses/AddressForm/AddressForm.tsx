import React, { useState } from 'react';
import { Address } from '@/common/types/user-types';
import s from './AddressForm.module.scss';

type Props = {
  initialData?: Partial<Address>;
  onSubmit: (data: Address) => void;
  onCancel: () => void;
};

export const AddressForm: React.FC<Props> = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Partial<Address>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.streetName) newErrors.streetName = 'Street name is required';
    if (!form.streetNumber) newErrors.streetNumber = 'Street number is required';
    if (!form.postalCode) newErrors.postalCode = 'Postal code is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const newAddress: Address = {
      id: form.id ?? crypto.randomUUID(),
      country: form.country!,
      city: form.city!,
      streetName: form.streetName!,
      streetNumber: form.streetNumber!,
      postalCode: form.postalCode!,
    };

    onSubmit(newAddress);
  };

  return (
    <div className={s.form}>
      {['country', 'city', 'streetName', 'streetNumber', 'postalCode'].map((field) => (
        <div key={field} className={s.field}>
          <label>{field}</label>
          <input
            type="text"
            value={form[field as keyof Address] || ''}
            onChange={(e) => handleChange(field as keyof Address, e.target.value)}
          />
          {errors[field] && <span className={s.error}>{errors[field]}</span>}
        </div>
      ))}

      <div className={s.actions}>
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
};
