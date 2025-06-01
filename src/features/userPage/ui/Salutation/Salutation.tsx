import { useUserStore } from '@/common/store/user-store';
import s from './Salutation.module.scss';

export const Salutation = () => {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);

  return (
    <div className={s.salutationWrapper}>
      <p>Hi,</p>
      <h2>
        {firstName} {lastName}
      </h2>
    </div>
  );
};
