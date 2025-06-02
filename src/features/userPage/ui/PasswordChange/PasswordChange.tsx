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
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);
  const setSuccess = useAppStore((s) => s.setSuccess);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSave = () => {
    clearError();
    const error = validatePassword(newPassword);
    if (error) {
      setValidationErrors((prev) => [...prev, error]);
      return;
    }

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
        setIsEditing(false);
      })
      .catch((e) => {
        setAppError(e.message || 'Password change failed');
      });
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    clearError();
    setIsEditing(false);
    setValidationErrors([]);
  };

  return (
    <div className={s.passwordWrapper}>
      <div className={s.titleWrapper}>
        <h2>Password</h2>
        <Pencil size={18} className={s.icon} onClick={() => setIsEditing(true)} />
      </div>

      {isEditing ? (
        <>
          <div className={s.labelWrapper}>
            <span>Current password</span>
            <InputField
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className={s.labelWrapper}>
            <span>New password</span>
            <InputField
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (e.target.value.length === 0) {
                  setValidationErrors([]);
                }
              }}
            />
            {validationErrors.map((error, index) => (
              <p key={index} className={s.error}>
                {error}
              </p>
            ))}
          </div>
          <div className={s.labelWrapper}>
            <span>Confirm password</span>
            <InputField
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={s.actions}>
            <Button className={s.button} onClick={handleSave}>
              Save Changes
            </Button>
            <Button className={s.button} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={s.labelWrapper}>
            <span>Current password</span>
            <InputField
              disabled
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              value="********"
              type="password"
            />
          </div>
          <div className={s.labelWrapper}>
            <span>New password</span>
            <InputField
              disabled
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              value="********"
              type="password"
            />
          </div>
          <div className={s.labelWrapper}>
            <span>Confirm password</span>
            <InputField
              disabled
              style={{ padding: '1.6rem 5.2rem 1.6rem 4.5rem' }}
              icon={<KeyRound size={14} />}
              value="********"
              type="password"
            />
          </div>
        </>
      )}
    </div>
  );
};
