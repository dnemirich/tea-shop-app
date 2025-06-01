import { InputHTMLAttributes } from 'react';
import s from './Checkbox.module.scss';

type Props = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({ label, ...props }: Props) => (
  <label className={s.checkbox}>
    <input type="checkbox" {...props} className={s.input} />
    <span className={s.span}>{label}</span>
  </label>
);
