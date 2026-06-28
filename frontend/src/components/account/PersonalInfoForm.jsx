import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { profileSchema } from '../../schemas/accountSchema.js';
import { toDateInputValue } from '../../utils/formatDate.js';

const inputClass =
  'h-12 w-full rounded-md border border-slate-100 bg-slate-100 px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50';

const labelClass = 'mb-2 block text-xs font-bold uppercase text-slate-600';

const FieldError = ({ message }) => (
  message ? <p className="mt-2 text-sm font-semibold text-red-600">{message}</p> : null
);

export const PersonalInfoForm = ({
  profile,
  isSubmitting,
  onSubmit,
}) => {
  const initialValues = useMemo(() => ({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    birthDate: toDateInputValue(profile?.birthDate),
  }), [profile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-50 text-[#2D7A7F]">
          <Icon name="user" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Cập nhật hồ sơ quản trị tài khoản.</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass}>Họ tên</label>
            <input id="fullName" className={inputClass} {...register('fullName')} />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Số điện thoại</label>
            <input id="phone" className={inputClass} {...register('phone')} />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <div className="flex flex-col gap-3 rounded-md border border-slate-100 bg-slate-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <input
              id="email"
              readOnly
              {...register('email')}
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
            />
            {profile?.emailVerified ? (
              <span className="inline-flex rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Đã xác minh
              </span>
            ) : null}
          </div>
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label htmlFor="birthDate" className={labelClass}>Ngày sinh</label>
          <input id="birthDate" type="date" className={inputClass} {...register('birthDate')} />
          <FieldError message={errors.birthDate?.message} />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2D7A7F] px-6 text-sm font-bold text-white transition hover:bg-[#25696d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
          Cập nhật thông tin
        </button>
      </div>
    </form>
  );
};
