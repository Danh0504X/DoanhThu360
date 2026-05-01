import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import { AuthCard } from '../../components/auth/AuthCard.jsx';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { PasswordInput } from '../../components/ui/PasswordInput.jsx';
import { TextInput } from '../../components/ui/TextInput.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { loginSchema } from '../../schemas/login.schema.js';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (formValues) => {
    try {
      setGlobalError('');
      await login({
        identifier: formValues.email,
        password: formValues.password,
        rememberMe: formValues.rememberMe,
      });

      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setGlobalError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleGoogleLogin = () => {
    setGlobalError('Đăng nhập Google cần hoàn thiện thêm ở backend để nhận idToken.');
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Quản lý doanh thu và hỗ trợ khai báo thuế cho doanh nghiệp."
      illustration={heroImage}
      footer={(
        <p className="text-center text-sm text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-teal-700 hover:text-teal-800">
            Đăng ký ngay
          </Link>
        </p>
      )}
    >
      <AuthCard>
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold text-slate-800">Đăng nhập tài khoản</p>
          <p className="mt-2 text-sm text-slate-500">
            Tiếp tục làm việc với dữ liệu doanh thu của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={globalError} />

          <TextInput
            id="login-email"
            type="email"
            label="Email"
            placeholder="ten@congty.com"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <PasswordInput
            id="login-password"
            label="Mật khẩu"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-200"
                {...register('rememberMe')}
              />
              Ghi nhớ đăng nhập
            </label>

            <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800">
              Quên mật khẩu?
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
              Đăng nhập
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
            >
              Tiếp tục với Google
            </Button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};
