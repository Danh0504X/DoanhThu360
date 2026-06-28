import { useNavigate } from 'react-router-dom';
import { PersonalInfoForm } from '../../components/account/PersonalInfoForm.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useProfile, useUpdateProfile } from '../../hooks/useAccount.js';

const SecurityActionRow = ({ icon, title, description, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
  >
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-50 text-[#2D7A7F]">
      <Icon name={icon} className="h-5 w-5" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{description}</p>
    </div>
    {badge ? (
      <span className="shrink-0 rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
        {badge}
      </span>
    ) : (
      <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-400" />
    )}
  </button>
);

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleUnsupportedAction = () => {
    toast.info('Chức năng này chưa được backend hỗ trợ.');
  };

  const handleNavigate = (item) => {
    if (item.id === 'dashboard') {
      navigate('/dashboard');
      return;
    }

    if (item.id === 'cash-flow') {
      navigate('/revenues');
      return;
    }

    if (item.to) {
      navigate(item.to);
      return;
    }

    handleUnsupportedAction();
  };

  const handleProfileSubmit = async (values) => {
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const emailVerified = Boolean(profileQuery.data?.emailVerified);
  const errorMessage = profileQuery.error?.message;

  const renderAccountContent = () => (
    <>
      {errorMessage ? <FormError message={errorMessage} className="rounded-md" /> : null}

      {profileQuery.isLoading ? (
        <section className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500">
          Đang tải thông tin tài khoản...
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <PersonalInfoForm
            profile={profileQuery.data}
            isSubmitting={updateProfileMutation.isPending}
            onSubmit={handleProfileSubmit}
          />

          <section className="self-start rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-xl font-bold text-slate-900">Bảo mật</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Quản lý mật khẩu và xác minh email của bạn.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              <SecurityActionRow
                icon="shield"
                title="Thay đổi mật khẩu"
                description="Cập nhật mật khẩu đăng nhập của bạn."
                onClick={() => navigate('/account/change-password')}
              />
              <SecurityActionRow
                icon="user"
                title="Xác minh Gmail"
                description={emailVerified ? 'Email của bạn đã được xác minh.' : 'Email chưa được xác minh.'}
                badge={emailVerified ? 'Đã xác minh' : null}
                onClick={() => navigate('/account/verify-email')}
              />
            </div>
          </section>
        </section>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:hidden">
        <MobileTopHeader title="Cá nhân" />

        <main className="px-4 pt-5">
          <h1 className="text-2xl font-bold text-slate-950">Cài đặt tài khoản</h1>
          <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">
            Quản lý thông tin cá nhân và thiết lập bảo mật.
          </p>

          {renderAccountContent()}
        </main>
      </div>

      <DashboardLayout
        activeNav="more"
        onNavigate={handleNavigate}
        onExport={handleUnsupportedAction}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[1180px]">
          <nav className="mb-6 flex items-center gap-3 text-xs font-bold text-slate-500">
            <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-[#2D7A7F]">
              Dashboard
            </button>
            <span>&gt;</span>
            <span className="text-[#2D7A7F]">Tài khoản</span>
          </nav>

          <div className="mb-7 rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase text-[#2D7A7F]">Account Settings</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Cài đặt tài khoản</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Quản lý thông tin cá nhân và thiết lập bảo mật cho tài khoản của bạn.
            </p>
          </div>

          {renderAccountContent()}
        </div>
      </DashboardLayout>
    </>
  );
};
