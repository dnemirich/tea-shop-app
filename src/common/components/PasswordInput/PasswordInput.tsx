import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { InputField } from '../InputField/InputField';
import s from '../InputField/InputField.module.scss';

type Props = {
  error?: string;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ error, icon, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <InputField
        {...props}
        icon={icon}
        ref={ref}
        error={error}
        type={show ? 'text' : 'password'}
        autoComplete="off"
        rightSlot={
          <button type="button" onClick={() => setShow(!show)} className={s.toggleButton}>
            {show ? 'Hide' : 'Show'}
          </button>
        }
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
