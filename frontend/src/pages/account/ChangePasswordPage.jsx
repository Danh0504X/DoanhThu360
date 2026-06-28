import { useNavigate } from 'react-router-dom';
import { AccountActionLayout } from '../../components/account/AccountActionLayout.jsx';
import { ChangePasswordForm } from '../../components/account/ChangePasswordForm.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useChangePassword } from '../../hooks/useAccount.js';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (values, reset) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      toast.success('Đổi mật khẩu thành công');
      reset();
      navigate('/account');
    } catch (error) {
      toast.error(error.message || 'Không thể đổi mật khẩu');
    }
  };

  return (
    <AccountActionLayout title="Đổi mật khẩu" breadcrumbLabel="Đổi mật khẩu">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Thay đổi mật khẩu</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật thông tin đăng nhập.
        </p>
      </div>

      <ChangePasswordForm
        isSubmitting={changePasswordMutation.isPending}
        onSubmit={handleSubmit}
      />
    </AccountActionLayout>
  );
};
