import s from './deliveryDetails.module.scss';

export const DeliveryDetails = () => {
  return (
    <div className={s.deliveryWrapper}>
      <p className={s.title}>Delivery Details</p>
      <div className={s.deliverySubWrapper}>
        <p className={s.detailsTitle}>Shipping address</p>
        <p className={s.address}>
          3 Falahi St , Falahi Ave, Pasdaran Blvd, Fars Province , Shiraz 71856-95159 Iran
        </p>
      </div>
      <div className={s.deliverySubWrapper}>
        <p className={s.detailsTitle}>Contact information</p>
        <p>Email@sdfk.lj</p>
      </div>
      <p className={s.link}>edit details</p>
    </div>
  );
};
