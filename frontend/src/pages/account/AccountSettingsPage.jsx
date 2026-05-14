import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { ChangePasswordForm } from '../../components/account/ChangePasswordForm.jsx';
import { EmailVerificationCard } from '../../components/account/EmailVerificationCard.jsx';
import { PersonalInfoForm } from '../../components/account/PersonalInfoForm.jsx';
import { RecentActivityCard } from '../../components/account/RecentActivityCard.jsx';
import { SecuritySupportCard } from '../../components/account/SecuritySupportCard.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import {
  useChangePassword,
  useProfile,
  useRecentActivities,
  useResendVerifyEmail,
  useUpdateProfile,
} from '../../hooks/useAccount.js';

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
  const profileQuery = useProfile();
  const recentActivitiesQuery = useRecentActivities();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const resendVerifyEmailMutation = useResendVerifyEmail();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleProfileSubmit = async (values) => {
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const handlePasswordSubmit = async (values, reset) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      toast.success('Đổi mật khẩu thành công');
      reset();
    } catch (error) {
      toast.error(error.message || 'Không thể đổi mật khẩu');
    }
  };

  const handleResendVerifyEmail = async () => {
    try {
      await resendVerifyEmailMutation.mutateAsync();
      toast.success('Đã gửi lại email xác minh');
    } catch (error) {
      toast.error(error.message || 'Không thể gửi lại email xác minh');
    }
  };

  const errorMessage = profileQuery.error?.message || recentActivitiesQuery.error?.message;

  return (
    <DashboardLayout
      userName={user?.name || user?.username || 'Người dùng'}
      businessOptions={[{ id: 'all', name: 'Chọn Hộ Kinh Doanh' }]}
      selectedBusiness="all"
      onBusinessChange={() => {}}
      onLogout={handleLogout}
      activeNav="account"
      pageTitle="Tài khoản"
      pageDescription="Cài đặt tài khoản"
      headingTitle="Tài khoản"
      headingDescription="Quản lý thông tin cá nhân và bảo mật"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Cài đặt tài khoản</h1>
        <p className="mt-2 text-sm text-slate-500">
          Quản lý thông tin cá nhân và thiết lập bảo mật cho tài khoản của bạn.
        </p>
      </section>

      {errorMessage ? <FormError message={errorMessage} /> : null}

      {profileQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải thông tin tài khoản...
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.86fr)]">
          <div className="space-y-6">
            <PersonalInfoForm
              profile={profileQuery.data}
              isSubmitting={updateProfileMutation.isPending}
              onSubmit={handleProfileSubmit}
            />

            <section className="relative overflow-hidden rounded-[28px] bg-teal-700 p-6 text-white shadow-sm">
              <div className="max-w-md">
                <h2 className="text-xl font-semibold">Tài khoản Doanh Nghiệp</h2>
                <p className="mt-2 text-sm leading-6 text-teal-50">
                  Bạn đang sử dụng gói quản trị chuyên sâu dành cho hộ kinh doanh cá thể.
                </p>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute bottom-4 right-4 text-white/15">
                <svg viewBox="0 0 24 24" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M12 3 5 6v6c0 4.2 2.7 8 7 9 4.3-1 7-4.8 7-9V6l-7-3Z" />
                </svg>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-slate-800">Bảo mật</h2>
              <div className="space-y-4">
                <EmailVerificationCard
                  isVerified={profileQuery.data?.emailVerified}
                  isSending={resendVerifyEmailMutation.isPending}
                  onResend={handleResendVerifyEmail}
                />
                <ChangePasswordForm
                  isSubmitting={changePasswordMutation.isPending}
                  onSubmit={handlePasswordSubmit}
                />
              </div>
            </section>

            <RecentActivityCard activities={recentActivitiesQuery.data || []} />
            <SecuritySupportCard />
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};
