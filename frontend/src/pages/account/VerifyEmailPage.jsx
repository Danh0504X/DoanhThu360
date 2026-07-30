import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountActionLayout } from '../../components/account/AccountActionLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { TextInput } from '../../components/ui/TextInput.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useProfile, useSendVerificationCode, useVerifyEmail } from '../../hooks/useAccount.js';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const profileQuery = useProfile();
  const sendCodeMutation = useSendVerificationCode();
  const verifyMutation = useVerifyEmail();

  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const email = profileQuery.data?.email || '';
  const isVerified = Boolean(profileQuery.data?.emailVerified);

  const handleSendCode = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await sendCodeMutation.mutateAsync();
      setCodeSent(true);
      setSuccessMessage(`Đã gửi mã xác minh đến ${email}. Mã có hiệu lực trong 10 phút.`);
      toast.success('Đã gửi mã xác minh');
    } catch (error) {
      const message = error.message || 'Không thể gửi mã xác minh.';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setErrorMessage('Vui lòng nhập mã gồm 6 chữ số.');
      return;
    }

    try {
      setErrorMessage('');
      await verifyMutation.mutateAsync({ code });
      toast.success('Xác minh email thành công');
      navigate('/account');
    } catch (error) {
      setErrorMessage(error.message || 'Mã không hợp lệ hoặc đã hết hạn.');
    }
  };

  const renderBody = () => {
    if (profileQuery.isLoading) {
      return <p className="text-sm font-medium text-bone-500">Đang tải thông tin tài khoản...</p>;
    }

    if (isVerified) {
      return (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="shield" className="h-7 w-7" />
          </span>
          <p className="mt-4 text-base font-bold text-bone-900">Email đã được xác minh</p>
          <p className="mt-1 text-sm text-bone-500">{email}</p>
          <Button type="button" size="lg" className="mt-6" onClick={() => navigate('/account')}>
            Quay lại tài khoản
          </Button>
        </div>
      );
    }

    if (!email) {
      return (
        <FormError message="Tài khoản của bạn chưa có địa chỉ email. Vui lòng cập nhật email trước khi xác minh." />
      );
    }

    return (
      <>
        <div className="rounded-md bg-bone-50 px-4 py-3">
          <p className="text-xs font-bold uppercase text-bone-500">Email cần xác minh</p>
          <p className="mt-1 text-sm font-semibold text-bone-800">{email}</p>
        </div>

        {errorMessage ? <FormError message={errorMessage} className="mt-4" /> : null}
        {successMessage ? <FormSuccess message={successMessage} className="mt-4" /> : null}

        {!codeSent ? (
          <Button
            type="button"
            fullWidth
            size="lg"
            className="mt-5"
            isLoading={sendCodeMutation.isPending}
            onClick={handleSendCode}
          >
            Gửi mã xác minh
          </Button>
        ) : (
          <form onSubmit={handleVerify} className="mt-5 space-y-4">
            <TextInput
              id="verify-code"
              label="Mã xác minh"
              placeholder="Nhập 6 chữ số"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />

            <Button type="submit" fullWidth size="lg" isLoading={verifyMutation.isPending}>
              Xác minh
            </Button>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={sendCodeMutation.isPending}
              className="w-full text-center text-sm font-medium text-primary-600 transition-brand hover:text-primary-700 disabled:opacity-60"
            >
              {sendCodeMutation.isPending ? 'Đang gửi lại...' : 'Gửi lại mã'}
            </button>
          </form>
        )}
      </>
    );
  };

  return (
    <AccountActionLayout title="Xác minh Gmail" breadcrumbLabel="Xác minh email">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bone-950">Xác minh email</h1>
        <p className="mt-2 text-sm leading-6 text-bone-600">
          Xác minh địa chỉ email giúp bảo vệ tài khoản và khôi phục mật khẩu khi cần.
        </p>
      </div>

      <section className="rounded-lg border border-bone-200 bg-white p-5">
        {renderBody()}
      </section>
    </AccountActionLayout>
  );
};
