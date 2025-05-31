import s from './Button.module.scss';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export const Button = ({ type, children, className, ...props }: ButtonProps) => {
  return (
    <button className={clsx(s.btn, className)} type={type} {...props}>
      {children}
    </button>
  );
};
