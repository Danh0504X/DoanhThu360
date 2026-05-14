import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../schemas/accountSchema.js';
import { toDateInputValue } from '../../utils/formatDate.js';
import { Button } from '../ui/Button.jsx';
import { TextInput } from '../ui/TextInput.jsx';

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
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4 20a8 8 0 0 1 16 0" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Thông tin cá nhân</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          id="fullName"
          label="Họ tên"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <TextInput
          id="phone"
          label="Số điện thoại"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <input
            id="email"
            readOnly
            {...register('email')}
            className="w-full bg-transparent text-slate-700 outline-none"
          />
          {profile?.emailVerified ? (
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Đã xác minh
            </span>
          ) : null}
        </div>
        {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>

      <div className="mt-4">
        <TextInput
          id="birthDate"
          type="date"
          label="Ngày sinh"
          {...register('birthDate')}
          error={errors.birthDate?.message}
        />
      </div>

      <Button type="submit" className="mt-6" isLoading={isSubmitting}>
        Cập nhật thông tin
      </Button>
    </form>
  );
};
