import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../../schemas/accountSchema.js';
import { Button } from '../ui/Button.jsx';
import { PasswordInput } from '../ui/PasswordInput.jsx';

export const ChangePasswordForm = ({ isSubmitting, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (values) => {
    await onSubmit(values, reset);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="text-base font-semibold text-slate-800">Thay đổi mật khẩu</h4>
      <div className="mt-4 space-y-4">
        <PasswordInput
          id="currentPassword"
          label="Mật khẩu hiện tại"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
        />
        <PasswordInput
          id="newPassword"
          label="Mật khẩu mới"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        <PasswordInput
          id="confirmPassword"
          label="Xác nhận mật khẩu mới"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button type="submit" variant="secondary" fullWidth className="mt-5" isLoading={isSubmitting}>
        Đổi mật khẩu
      </Button>
      <button type="button" className="mt-3 w-full text-center text-xs text-slate-400 transition hover:text-slate-600">
        Quên mật khẩu?
      </button>
    </form>
  );
};
