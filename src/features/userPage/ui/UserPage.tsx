import { useState } from 'react';
import { LeftSide } from './LeftSide/LeftSide';
import { RightSide } from './RightSide/RightSide';
import s from './UserPage.module.scss';
import { useUserStore } from '@/common/store/user-store.ts';
import { ROUTES } from '@/common/config/routes.ts';
import { Navigate } from 'react-router';

export const UserPage = () => {
  const [selectedOption, setSelectedOption] = useState<
    'MyDetails' | 'Addresses' | 'PasswordChange' | null
  >(null);

  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className={s.wrapper}>
      <LeftSide setSelectedOption={setSelectedOption} />
      <RightSide selectedOption={selectedOption} />
    </div>
  );
};
