import { InputField } from '@/common/components/InputField/InputField.tsx';
import { Button } from '@/common/components/Button/Button.tsx';
import s from './promocodeBox.module.scss';
import { useState } from 'react';
import { checkDiscountCode } from '@/common/api/products-api.ts';

type Props = {
  onPromoCodeSuccess: (code: string) => void;
};

export const PromocodeBox = ({ onPromoCodeSuccess }: Props) => {
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const validateCode = (code: string): boolean => {
    const regex = /^[a-zA-Z0-9]{6}$/;
    return regex.test(code);
  };

  const handleApply = async () => {
    setValidationError(null);
    setIsChecking(true);

    if (!validateCode(code)) {
      setValidationError('Code must be 6 characters long and contain only letters and numbers.');
      setIsChecking(false);
      return;
    }

    try {
      const response = await checkDiscountCode(code);
      if (response.body.results.length > 0) {
        onPromoCodeSuccess(code);
        setIsApplied(true);
      } else {
        setValidationError('This promo code does not exist.');
      }
    } catch (error) {
      console.error('Error checking promo code:', error);
      setValidationError('Failed to validate promo code. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={s.box}>
      <InputField
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={'Enter your promocode'}
        disabled={isChecking || isApplied}
      />
      {validationError && <p className={s.error}>{validationError}</p>}
      <Button onClick={handleApply} disabled={isChecking || isApplied}>
        {isChecking ? 'Checking...' : 'Apply promocode'}
      </Button>
    </div>
  );
};

// FPbker
