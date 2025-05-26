import { ReactNode } from 'react';
import s from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  disabled?: boolean;
  icon?: ReactNode;
};

export const Button = ({ type, text, icon, disabled = false, ...props }: ButtonProps) => {
  return (
    <button className={s.btn} type={type} {...props}>
      {icon && <span className={s.icon}>{icon}</span>}
      {text}
    </button>
  );
};
