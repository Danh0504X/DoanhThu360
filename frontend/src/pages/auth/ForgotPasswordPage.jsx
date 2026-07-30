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
import { TextInput } from '../../components/ui/TextInput.jsx';
import { useForgotPassword } from '../../hooks/useAuth.js';
import { forgotPasswordSchema } from '../../schemas/forgotPassword.schema.js';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (formValues) => {
    try {
      setGlobalError('');
      setSuccessMessage('');
      await forgotPasswordMutation.mutateAsync({ email: formValues.email });
      setSuccessMessage('Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi mã đặt lại mật khẩu. Đang chuyển đến bước nhập mã...');
      // Move the user to the reset step with their email prefilled.
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(formValues.email)}`);
      }, 1200);
    } catch (error) {
      setGlobalError(error.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận hướng dẫn khôi phục mật khẩu."
      illustration={heroImage}
      footer={(
        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-primary-700 hover:text-primary-800">
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    >
      <AuthCard>
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold text-bone-800">Lấy lại quyền truy cập</p>
          <p className="mt-2 text-sm text-bone-500">
            Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={globalError} />
          <FormSuccess message={successMessage} />

          <TextInput
            id="forgot-email"
            type="email"
            label="Email"
            placeholder="example@domain.vn"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting || forgotPasswordMutation.isPending}>
            Gửi yêu cầu
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};
