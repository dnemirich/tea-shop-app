import { useState } from 'react';
import { LeftSide } from './LeftSide/LeftSide';
import { RightSide } from './RightSide/RightSide';
import s from './UserPage.module.scss';

export const UserPage = () => {
  const [selectedOption, setSelectedOption] = useState<'MyDetails' | 'Addresses' | null>(null);

  return (
    <div className={s.wrapper}>
      <LeftSide setSelectedOption={setSelectedOption} />
      <RightSide selectedOption={selectedOption} />
    </div>
  );
};
