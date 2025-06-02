import { useState } from 'react';
import s from './PasswordChange.module.scss';
import { KeyRound, Pencil } from 'lucide-react';
import { Button } from '@/common/components/Button/Button';
import { useAppStore } from '@/common/store/app-store';
import { changePassword } from '@/features/login/api/authService';
import { InputField } from '@/common/components/InputField/InputField';

export const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);
  const setSuccess = useAppStore((s) => s.setSuccess);

  const handleSave = () => {
    clearError();

    if (newPassword !== confirmPassword) {
      setAppError('New password do not match');
      return;
    }

    changePassword(currentPassword, newPassword)
      .then(() => {
        setSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((e) => {
        setAppError(e.message || 'Password change failed');
      });
  };

  return (
    <div className={s.passwordWrapper}>
      <div className={s.titleWrapper}>
        <h2>Password</h2>
        <Pencil size={18} className={s.icon} />
      </div>
      <div className={s.labelWrapper}>
        <InputField
          style={{
            padding: '1.6rem 5.2rem 1.6rem 4.5rem',
          }}
          icon={<KeyRound size={14} />}
          placeholder="Enter current password"
          type="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className={s.labelWrapper}>
        <InputField
          style={{
            padding: '1.6rem 5.2rem 1.6rem 4.5rem',
          }}
          icon={<KeyRound size={14} />}
          placeholder="Enter new password password"
          type="text"
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={s.labelWrapper}>
        <InputField
          style={{
            padding: '1.6rem 5.2rem 1.6rem 4.5rem',
          }}
          icon={<KeyRound size={14} />}
          placeholder="Confirm password"
          type="text"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button type="button" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
