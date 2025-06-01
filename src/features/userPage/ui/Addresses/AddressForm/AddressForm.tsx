import React, { useState } from 'react';
import { Address, Countries } from '@/common/types/user-types';
import s from './AddressForm.module.scss';
import { Button } from '@/common/components/Button/Button';
import { useAppStore } from '@/common/store/app-store';

type Props = {
  initialData?: Partial<Address>;
  onSubmit: (data: Address) => void;
  onCancel: () => void;
};

const CountryOptions = [
  { value: Countries.Belarus, label: 'Belarus' },
  { value: Countries.Russia, label: 'Russia' },
  { value: Countries.Kazakhstan, label: 'Kazakhstan' },
  { value: Countries.Armenia, label: 'Armenia' },
  { value: Countries.Uzbekistan, label: 'Uzbekistan' },
];

export const AddressForm: React.FC<Props> = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Partial<Address>>({
    ...initialData,
    country: initialData.country || Countries.Belarus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);

  const handleChange = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const numberRegex = /^\d+$/;
    const stringRegex = /^[a-zA-Zа-яА-ЯёЁ\s'-]+$/;

    if (!form.country) newErrors.country = 'Country is required';
    if (!form.city) newErrors.city = 'City is required';

    if (!form.streetName) {
      newErrors.streetName = 'Street name is required';
    } else if (!stringRegex.test(form.streetName.trim())) {
      newErrors.streetName = 'Street name can only contain letters and spaces';
    }

    if (!form.streetNumber) {
      newErrors.streetNumber = 'Street number is required';
    } else if (!numberRegex.test(form.streetNumber)) {
      newErrors.streetNumber = 'Street number must be a number';
    }

    if (!form.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!numberRegex.test(form.postalCode)) {
      newErrors.postalCode = 'Postal code must be a number';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    clearError();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setAppError('Please fill all required fields');
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

  const fields: { label: string; key: keyof Address; type?: 'select' | 'text' }[] = [
    {
      label: 'Country',
      key: 'country',
      type: 'select',
    },
    { label: 'City', key: 'city' },
    { label: 'Street Name', key: 'streetName' },
    { label: 'Street Number', key: 'streetNumber' },
    { label: 'Postal Code', key: 'postalCode' },
  ];

  return (
    <div className={s.form}>
      {fields.map(({ label, key, type = 'text' }) => (
        <div key={key} className={s.field}>
          <label>{label}</label>
          {type === 'select' && key === 'country' ? (
            <select
              value={form.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
              className={errors.country ? s.errorInput : ''}
            >
              {CountryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={form[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={errors[key] ? s.errorInput : ''}
            />
          )}
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
