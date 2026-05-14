import { Button } from '../ui/Button.jsx';

export const EmailVerificationCard = ({ isVerified, isSending, onResend }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">Xác minh Email</p>
        <p className="mt-1 text-sm text-slate-500">
          {isVerified ? 'Email của bạn đã được bảo vệ' : 'Email chưa được xác minh'}
        </p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'
      }`}>
        {isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
      </span>
    </div>

    {!isVerified ? (
      <Button type="button" variant="ghost" className="mt-3 px-0" onClick={onResend} isLoading={isSending}>
        Gửi lại email xác minh
      </Button>
    ) : null}
  </div>
);
