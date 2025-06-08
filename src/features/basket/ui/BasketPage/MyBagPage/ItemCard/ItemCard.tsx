import { Counter } from '../../Counter/Counter';
import s from './itemCard.module.scss';

export const ItemCard = () => {
  return (
    <div className={s.itemCardWrapper}>
      <img
        src="https://www.chay.info/upload/webp/iblock/39e/39e8603b9729b5019fbd813914da956f.webp"
        alt="info"
      />
      <div className={s.wrapper}>
        <div className={s.subWrapper}>
          <p className={s.teaInfo}>Ceylon Ginger Cinnamon chai tea - 50 g</p>
          <Counter />
        </div>
        <div className={s.subWrapper}>
          <span className={s.remove}>remove</span>
          <p className={s.cost}>Cost</p>
        </div>
      </div>
    </div>
  );
};
