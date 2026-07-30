import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { profileSchema } from '../../schemas/account.schema.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { TextInput } from '../ui/TextInput.jsx';
import { toDateInputValue } from '../../utils/formatDate.js';

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
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-bone-200 bg-white">
      <div className="flex items-center gap-3 border-b border-bone-200 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-sm bg-primary-50 text-primary-600">
          <Icon name="user" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-bone-800">Thông tin cá nhân</h2>
          <p className="mt-1 text-sm font-medium text-bone-500">Cập nhật hồ sơ quản trị tài khoản.</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput id="fullName" label="Họ tên" error={errors.fullName?.message} {...register('fullName')} />
          <TextInput id="phone" label="Số điện thoại" error={errors.phone?.message} {...register('phone')} />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-bone-700">Email</label>
          <div className="flex flex-col gap-3 rounded-sm border border-bone-100 bg-bone-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <input
              id="email"
              readOnly
              {...register('email')}
              className="w-full bg-transparent text-sm font-semibold text-bone-700 outline-none"
            />
            {profile?.emailVerified ? <Badge tone="emerald">Đã xác minh</Badge> : null}
          </div>
          {errors.email?.message ? <p className="mt-2 text-sm text-accent-red">{errors.email.message}</p> : null}
        </div>

        <TextInput id="birthDate" type="date" label="Ngày sinh" error={errors.birthDate?.message} {...register('birthDate')} />
      </div>

      <div className="border-t border-bone-200 bg-bone-50 px-5 py-5">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Cập nhật thông tin
        </Button>
      </div>
    </form>
  );
};
