import React, { useState } from 'react';
import { Address } from '@/common/types/user-types';
import s from './AddressForm.module.scss';
import { Button } from '@/common/components/Button/Button';

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

  const fields: { label: string; key: keyof Address }[] = [
    { label: 'Country', key: 'country' },
    { label: 'City', key: 'city' },
    { label: 'Street Name', key: 'streetName' },
    { label: 'Street Number', key: 'streetNumber' },
    { label: 'Postal Code', key: 'postalCode' },
  ];

  return (
    <div className={s.form}>
      {fields.map(({ label, key }) => (
        <div key={key} className={s.field}>
          <label>{label}</label>
          <input
            type="text"
            value={form[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
          />
          {errors[key] && <span className={s.error}>{errors[key]}</span>}
        </div>
      ))}

      <div className={s.actions}>
        <Button className={s.button} onClick={handleSubmit}>
          Save
        </Button>
        <Button className={s.button} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
