import { useEffect, useState } from 'react';
import { getDiscountCodes } from '@/common/api/products-api.ts';
import { getRandomDiscountCode } from '@/common/utils/discountHelpers.ts';

export const usePromoCode = () => {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const wasShown = localStorage.getItem('promo-shown');
    if (wasShown) {
      return;
    }
    getDiscountCodes().then(codes => {
      const randomCode = getRandomDiscountCode(codes);
      if (randomCode) {
        setCode(randomCode.code);
      }
    })
  }, [])

  return code;
};