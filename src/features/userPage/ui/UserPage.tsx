import { LeftSide } from './LeftSide/LeftSide';
import { RightSide } from './RightSide/RightSide';
import s from './UserPage.module.scss';

export const UserPage = () => {
  return (
    <div className={s.wrapper}>
      <LeftSide />
      <RightSide />
    </div>
  );
};
