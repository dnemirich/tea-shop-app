import { useUserStore } from '@/common/store/user-store';
import s from './MyDetails.module.scss';

export const MyDetails = () => {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const dateOfBirth = useUserStore((state) => state.dateOfBirth);

  return (
    <div className={s.myDetailsWrapper}>
      <h2>My details</h2>
      <div className={s.info}>
        <span>First name</span>
        <p>{firstName}</p>
      </div>
      <div className={s.info}>
        <span>Last name</span>
        <p>{lastName}</p>
      </div>
      <div className={s.info}>
        <span>Date of birth</span>
        <p>{dateOfBirth}</p>
      </div>
    </div>
  );
};
