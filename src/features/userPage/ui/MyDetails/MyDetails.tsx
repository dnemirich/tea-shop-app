import { useUserStore } from '@/common/store/user-store';
import s from './MyDetails.module.scss';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/common/components/Button/Button';
import { updateCustomer } from '../../api/user-api';

export const MyDetails = () => {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const dateOfBirth = useUserStore((state) => state.dateOfBirth);

  const [isEditing, setIsEditing] = useState(false);

  const [firstNameValue, setFirstNameValue] = useState(firstName || '');
  const [lastNameValue, setLastNameValue] = useState(lastName || '');
  const [dateOfBirthValue, setdateOfBirthValue] = useState(dateOfBirth || '');

  const updateUser = useUserStore((state) => state.updateUserInfo);
  const email = useUserStore((state) => state.email);
  const password = useUserStore((state) => state.password);

  const handleSave = async () => {
    try {
      if (!email) {
        console.error('Missing email');
        return;
      }

      if (!password) {
        console.error('Missing password');
        return;
      }

      await updateCustomer(
        {
          firstName: firstNameValue,
          lastName: lastNameValue,
          dateOfBirth: dateOfBirthValue,
        },
        email,
        password,
      );

      updateUser({
        firstName: firstNameValue,
        lastName: lastNameValue,
        dateOfBirth: dateOfBirthValue,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
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
