import { SelectHTMLAttributes } from 'react';
import s from './SelectField.module.scss';

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({ options, error, ...props }: Props) => {
  return (
    <div className={s.selectWrapper}>
      <select {...props} className={s.select}>
        <option value="">Country</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
};
