import s from './paymentType.module.scss';

export const PaymentType = () => {
  const images = [
    new URL('@/assets/cards/Visa.svg', import.meta.url).href,
    new URL('@/assets/cards/maestro-dark-large.svg', import.meta.url).href,
    new URL('@/assets/cards/mastercard-dark-large.svg', import.meta.url).href,
    new URL('@/assets/cards/Group 29.svg', import.meta.url).href,
    new URL('@/assets/cards/Group 30.svg', import.meta.url).href,
  ];

  return (
    <div className={s.paymentTypeWrapper}>
      <p>Payment type</p>
      <div className={s.images}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`image-${index}`} />
        ))}
      </div>
    </div>
  );
};
