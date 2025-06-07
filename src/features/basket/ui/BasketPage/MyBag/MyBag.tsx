import { ItemsContainer } from '../ItemsContainer/ItemsContainer';
import s from './myBag.module.scss';

export const MyBag = () => {
  return (
    <div className={s.myBagWrapper}>
      <ItemsContainer />
    </div>
  );
};
