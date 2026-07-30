import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import { AuthCard } from '../../components/auth/AuthCard.jsx';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { PasswordInput } from '../../components/ui/PasswordInput.jsx';
import { TextInput } from '../../components/ui/TextInput.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePublicRegistrationStatus } from '../../hooks/useAdmin.js';
import { registerSchema } from '../../schemas/register.schema.js';

const buildUsernameFromEmail = (email) => {
  const normalized = email
    .toLowerCase()
    .replace(/@/g, '_')
    .replace(/[^a-z0-9._-]/g, '');

  if (normalized.length >= 3) {
    return normalized.slice(0, 50);
  }

  return `${normalized}user`.slice(0, 50);
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const registrationStatusQuery = usePublicRegistrationStatus();
  const isRegistrationClosed = registrationStatusQuery.data === false;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formValues) => {
    try {
      setGlobalError('');
      setSuccessMessage('');

      await registerAccount({
        username: buildUsernameFromEmail(formValues.email),
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });

      setSuccessMessage('Đăng ký thành công. Bạn có thể đăng nhập để bắt đầu sử dụng Doanh Thu 360.');
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (error) {
      setGlobalError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Bắt đầu quản lý doanh thu chuyên nghiệp ngay hôm nay."
      illustration={heroImage}
      footer={(
        <p className="text-center text-sm text-bone-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary-700 hover:text-primary-800">
            Đăng nhập
          </Link>
        </p>
      )}
    >
      <AuthCard>
        {isRegistrationClosed ? (
          <div className="py-4 text-center">
            <p className="text-base font-bold text-bone-800">Đăng ký tài khoản mới hiện đang tạm khoá</p>
            <p className="mt-2 text-sm leading-6 text-bone-500">
              Hệ thống hiện không nhận đăng ký tài khoản mới. Vui lòng quay lại sau hoặc liên hệ quản trị viên.
            </p>
            <Button className="mt-5" fullWidth onClick={() => navigate('/login')}>
              Về trang đăng nhập
            </Button>
          </div>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={globalError} />
          <FormSuccess message={successMessage} />

          <TextInput
            id="register-name"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />

          <TextInput
            id="register-email"
            type="email"
            label="Email"
            placeholder="example@company.com"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <PasswordInput
            id="register-password"
            label="Mật khẩu"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <PasswordInput
            id="register-confirm-password"
            label="Xác nhận mật khẩu"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
            Đăng ký
          </Button>
        </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
};
