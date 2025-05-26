import s from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  disabled?: boolean;
};

export const Button = ({ type, text, disabled = false, ...props }: ButtonProps) => {
  return (
    <button className={s.btn} type={type} {...props}>
      {text}
    </button>
  );
};
