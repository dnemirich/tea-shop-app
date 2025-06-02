import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import s from './InputField.module.scss';

type Props = {
  icon?: ReactNode;
  error?: string;
  info?: string;
  wrapperClass?: string;
  rightSlot?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = forwardRef<HTMLInputElement, Props>(
  ({ icon, error, info, rightSlot, className = '', wrapperClass = '', ...props }, ref) => {
    return (
      <div className={`${s.wrapper} ${wrapperClass}`}>
        <label className={s.label}>
          {icon && <span className={s.icon}>{icon}</span>}
          <input ref={ref} {...props} className={`${s.input} ${className}`} />
          {rightSlot}
        </label>
        {info && <p className={s.info}>{info}</p>}
        {error && <p className={s.error}>{error}</p>}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
