import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessSchema, BUSINESS_TYPE_OPTIONS } from '../../schemas/businessSchema.js';
import { Button } from '../ui/Button.jsx';
import { FormError } from '../ui/FormError.jsx';
import { TextInput } from '../ui/TextInput.jsx';

export const BusinessForm = ({
  mode = 'create',
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  errorMessage,
}) => {
  const initialValues = useMemo(() => ({
    name: defaultValues?.name || defaultValues?.businessName || '',
    taxCode: defaultValues?.taxCode || '',
    businessType: defaultValues?.businessType || 'retail',
    address: defaultValues?.address || '',
    phone: defaultValues?.phone || '',
    email: defaultValues?.email || '',
    status: defaultValues?.status || 'active',
    note: defaultValues?.note || defaultValues?.representativeName || '',
  }), [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessSchema),
    values: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormError message={errorMessage} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            id="name"
            label="Tên hộ kinh doanh"
            placeholder="Nhập tên hộ kinh doanh"
            {...register('name')}
            error={errors.name?.message}
          />
          <TextInput
            id="taxCode"
            label="Mã số thuế"
            placeholder="Nhập mã số thuế"
            {...register('taxCode')}
            error={errors.taxCode?.message}
          />

          <div>
            <label htmlFor="businessType" className="mb-2 block text-sm font-medium text-slate-700">
              Loại hình kinh doanh
            </label>
            <select
              id="businessType"
              {...register('businessType')}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              {BUSINESS_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.businessType ? <p className="mt-2 text-sm text-red-600">{errors.businessType.message}</p> : null}
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              id="status"
              {...register('status')}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          <TextInput
            id="phone"
            label="Số điện thoại"
            placeholder="0987 654 321"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <TextInput
            id="email"
            type="email"
            label="Email"
            placeholder="example@domain.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="mt-4">
          <TextInput
            id="address"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ kinh doanh"
            {...register('address')}
            error={errors.address?.message}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700">
            Ghi chú
          </label>
          <textarea
            id="note"
            rows="4"
            placeholder="Thông tin bổ sung về hộ kinh doanh"
            {...register('note')}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === 'create' ? 'Tạo hộ kinh doanh' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
};
