import { usePromoCode } from '@/features/home/hooks/usePromoCode.ts';
import { useState } from 'react';
import { Button } from '@/common/components/Button/Button.tsx';
import { CircleX } from 'lucide-react';
import s from './discountPopup.module.scss';

export const DiscountPopup = () => {
  const code = usePromoCode();
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!code || !visible) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      localStorage.setItem('promo-shown', 'true');
      setTimeout(() => setVisible(false), 2000);
    } catch (err) {
      console.error('Не удалось скопировать:', err);
    }
  };

  return (
    <div className={s.popup}>
      <Button onClick={() => setVisible(false)} className={s.btn}>
        <CircleX color={'#282828'} />
      </Button>
      {copied ? (
        <p className={s.copied}>Promo code copied to clipboard!</p>
      ) : (
        <>
          <h4 className={s.header}>You get a discount on your first purchase!</h4>
          <p className={s.text}>
            Use promo code{' '}
            <button className={s.code} onClick={handleCopy}>
              {code}
            </button>{' '}
            to get 10% off your first order!
          </p>
        </>
      )}
    </div>
  );
};
