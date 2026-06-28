import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import { AuthCard } from '../../components/auth/AuthCard.jsx';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { PasswordInput } from '../../components/ui/PasswordInput.jsx';
import { TextInput } from '../../components/ui/TextInput.jsx';
import { useResetPassword } from '../../hooks/useAuth.js';
import { resetPasswordSchema } from '../../schemas/resetPassword.schema.js';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
      email: searchParams.get('email') || '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formValues) => {
    try {
      setGlobalError('');
      setSuccessMessage('');
      await resetPasswordMutation.mutateAsync({
        email: formValues.email,
        code: formValues.code,
        newPassword: formValues.password,
      });
      setSuccessMessage('Mật khẩu của bạn đã được cập nhật thành công. Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (error) {
      setGlobalError(error.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      subtitle="Nhập mã xác nhận trong email và thiết lập mật khẩu mới."
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
            Chúng tôi đã gửi mã gồm 6 chữ số tới email của bạn. Nhập mã đó cùng mật khẩu mới.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={globalError} />
          <FormSuccess message={successMessage} />

          <TextInput
            id="reset-email"
            type="email"
            label="Email"
            placeholder="example@domain.vn"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <TextInput
            id="reset-code"
            label="Mã xác nhận"
            placeholder="Nhập 6 chữ số"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            {...register('code')}
            error={errors.code?.message}
          />

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
          >
            Cập nhật mật khẩu
          </Button>

          <p className="text-center text-sm text-slate-500">
            Chưa nhận được mã?{' '}
            <Link to="/forgot-password" className="font-medium text-teal-700 hover:text-teal-800">
              Gửi lại
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};
