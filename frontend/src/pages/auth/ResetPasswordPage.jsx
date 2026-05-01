import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import { AuthCard } from '../../components/auth/AuthCard.jsx';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { PasswordInput } from '../../components/ui/PasswordInput.jsx';
import { useResetPassword } from '../../hooks/useAuth.js';
import { resetPasswordSchema } from '../../schemas/resetPassword.schema.js';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formValues) => {
    if (!token) {
      setGlobalError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return;
    }

    try {
      setGlobalError('');
      setSuccessMessage('');
      await resetPasswordMutation.mutateAsync({
        token,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
      });
      setSuccessMessage('Mật khẩu của bạn đã được cập nhật thành công.');
    } catch (error) {
      setGlobalError(error.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      subtitle="Thiết lập mật khẩu mới để tiếp tục truy cập hệ thống."
      illustration={heroImage}
      footer={(
        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-teal-700 hover:text-teal-800">
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    >
      <AuthCard>
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold text-slate-800">Thiết lập mật khẩu mới</p>
          <p className="mt-2 text-sm text-slate-500">
            Vui lòng nhập mật khẩu mới của bạn để tiếp tục truy cập vào hệ thống.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={globalError} />
          <FormSuccess message={successMessage} />

          <PasswordInput
            id="reset-password"
            label="Mật khẩu mới"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <PasswordInput
            id="reset-confirm-password"
            label="Xác nhận mật khẩu mới"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting || resetPasswordMutation.isPending}
            disabled={!token}
          >
            Cập nhật mật khẩu
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};
