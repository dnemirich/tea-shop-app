import { useUserStore } from '@/common/store/user-store';
import s from './MyDetails.module.scss';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/common/components/Button/Button';

export const MyDetails = () => {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const dateOfBirth = useUserStore((state) => state.dateOfBirth);

  const [isEditing, setIsEditing] = useState(false);

  const [firstNameValue, setFirstNameValue] = useState(firstName || '');
  const [lastNameValue, setLastNameValue] = useState(lastName || '');
  const [dateOfBirthValue, setdateOfBirthValue] = useState(dateOfBirth || '');

  const updateUser = useUserStore((state) => state.updateUserInfo);

  const handleSave = () => {
    updateUser({
      firstName: firstNameValue,
      lastName: lastNameValue,
      dateOfBirth: dateOfBirthValue,
    });
    setIsEditing(false);
  };

  return (
    <div className={s.myDetailsWrapper}>
      <div className={s.titleWrapper}>
        <h2>My details</h2>
        <Pencil size={16} className={s.icon} onClick={() => setIsEditing(true)} />
      </div>
      <div className={s.info}>
        <span>First name</span>
        {isEditing ? (
          <input value={firstNameValue ?? ''} onChange={(e) => setFirstNameValue(e.target.value)} />
        ) : (
          <p>{firstName}</p>
        )}
      </div>
      <div className={s.info}>
        <span>Last name</span>
        {isEditing ? (
          <input value={lastNameValue ?? ''} onChange={(e) => setLastNameValue(e.target.value)} />
        ) : (
          <p>{lastName}</p>
        )}
      </div>
      <div className={s.info}>
        <span>Date of birth</span>
        {isEditing ? (
          <input
            type="date"
            value={dateOfBirthValue ?? ''}
            onChange={(e) => setdateOfBirthValue(e.target.value)}
          />
        ) : (
          <p>{dateOfBirth}</p>
        )}
      </div>
      {isEditing ? <Button text="Save changes" onClick={handleSave} /> : ''}
    </div>
  );
};
