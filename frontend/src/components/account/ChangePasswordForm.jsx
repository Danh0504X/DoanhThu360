import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../../schemas/account.schema.js';
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="rounded-md border border-bone-200 bg-white p-4">
      <h4 className="text-base font-bold text-bone-900">Thay đổi mật khẩu</h4>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-600 text-sm font-bold text-white transition-brand hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
        Đổi mật khẩu
      </button>
    </form>
  );
};
