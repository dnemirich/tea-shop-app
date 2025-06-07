import { ItemsContainer } from '../ItemsContainer/ItemsContainer';
import { RightSide } from '../RightSide/RightSide';
import s from './myBag.module.scss';

export const MyBag = () => {
  return (
    <div className={s.myBagWrapper}>
      <ItemsContainer />
      <RightSide />
    </div>
  );
};
