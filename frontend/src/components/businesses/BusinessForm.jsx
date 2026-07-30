import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessSchema } from '../../schemas/business.schema.js';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { FormError } from '../ui/FormError.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
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

      <div className="flex items-start gap-3 rounded-md border border-primary-100 bg-primary-50 px-4 py-3">
        <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
        <p className="text-sm leading-6 text-primary-800">
          <strong>Tên, mã số thuế và địa chỉ là bắt buộc</strong> — hệ thống cần đủ 3 thông tin này để tổng hợp và xuất báo cáo thuế chính xác sau này.
        </p>
      </div>

      <Card padding="lg">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            id="name"
            label="Tên hộ kinh doanh *"
            placeholder="Nhập tên hộ kinh doanh"
            {...register('name')}
            error={errors.name?.message}
          />
          <TextInput
            id="taxCode"
            label="Mã số thuế *"
            placeholder="VD: 0312345678"
            {...register('taxCode')}
            error={errors.taxCode?.message}
          />
        </div>

        <div className="mt-5">
          <TextInput
            id="address"
            label="Địa chỉ *"
            placeholder="Nhập địa chỉ kinh doanh"
            {...register('address')}
            error={errors.address?.message}
          />
        </div>

        <div className="mt-6 grid gap-5 border-t border-bone-100 pt-5 md:grid-cols-2">
          <TextInput
            id="phone"
            label="Số điện thoại (tùy chọn)"
            placeholder="0987 654 321"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <TextInput
            id="email"
            type="email"
            label="Email (tùy chọn)"
            placeholder="example@domain.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="note" className="mb-2 block text-sm font-medium text-bone-700">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            id="note"
            rows="3"
            placeholder="Thông tin bổ sung về hộ kinh doanh"
            {...register('note')}
            className="w-full resize-none rounded-sm border border-bone-200 bg-white px-4 py-3 text-bone-800 outline-none transition-brand placeholder:text-bone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </Card>

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
