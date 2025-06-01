import { useUserStore } from '@/common/store/user-store';
import s from './MyDetails.module.scss';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/common/components/Button/Button';
import { updateCustomer } from '../../api/user-api';
import { useAppStore } from '@/common/store/app-store';
import { formatDate } from './formatDate';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format')
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date <= today;
    }, 'Date of birth cannot be in the future'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine((val) => !/[а-яА-ЯёЁ]/.test(val), 'Email must not contain Cyrillic characters'),
});

type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

export const MyDetails = () => {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const dateOfBirth = useUserStore((state) => state.dateOfBirth);
  const emailAddress = useUserStore((state) => state.email);
  const password = useUserStore((state) => state.password);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth || '',
      email: emailAddress || '',
    },
  });

  const updateUser = useUserStore((state) => state.updateUserInfo);
  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);
  const setSuccess = useAppStore((s) => s.setSuccess);

  const handleEditClick = () => {
    reset({
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth || '',
      email: emailAddress || '',
    });
    setIsEditing(true);
  };

  const onSubmit = async (data: UserDetailsFormData) => {
    try {
      if (!emailAddress || !password) {
        setAppError('Authentication required');
        return;
      }

      await updateCustomer(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
        },
        emailAddress,
        password,
      );

      updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
      });

      clearError();
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      setAppError('Failed to update your profile');
    }
  };

  return (
    <div className={s.myDetailsWrapper}>
      <div className={s.titleWrapper}>
        <h2>My details</h2>
        {!isEditing && <Pencil size={18} className={s.icon} onClick={handleEditClick} />}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={s.info}>
            <span>First name</span>
            <input {...register('firstName')} className={errors.firstName ? s.errorInput : ''} />
            {errors.firstName && <p className={s.errorMessage}>{errors.firstName.message}</p>}
          </div>
          <div className={s.info}>
            <span>Last name</span>
            <input {...register('lastName')} className={errors.lastName ? s.errorInput : ''} />
            {errors.lastName && <p className={s.errorMessage}>{errors.lastName.message}</p>}
          </div>
          <div className={s.info}>
            <span>Date of birth</span>
            <input
              type="date"
              {...register('dateOfBirth')}
              className={errors.dateOfBirth ? s.errorInput : ''}
            />
            {errors.dateOfBirth && <p className={s.errorMessage}>{errors.dateOfBirth.message}</p>}
          </div>
          <div className={s.info}>
            <span>Email address</span>
            <input
              type="email"
              {...register('email')}
              className={errors.email ? s.errorInput : ''}
            />
            {errors.email && <p className={s.errorMessage}>{errors.email.message}</p>}
          </div>
          <div className={s.buttonGroup}>
            <Button type="submit">Save changes</Button>
            <Button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={s.info}>
            <span>First name</span>
            <p className={s.infoP}>{firstName}</p>
          </div>
          <div className={s.info}>
            <span>Last name</span>
            <p className={s.infoP}>{lastName}</p>
          </div>
          <div className={s.info}>
            <span>Date of birth</span>
            <p className={s.infoP}>{formatDate(dateOfBirth)}</p>
          </div>
          <div className={s.info}>
            <span>Email address</span>
            <p className={s.infoP}>{emailAddress}</p>
          </div>
        </>
      )}
    </div>
  );
};
