import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { revenueSchema } from '../../schemas/revenueSchema.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { toDateInputValue } from '../../utils/formatDate.js';
import { Button } from '../ui/Button.jsx';
import { FormError } from '../ui/FormError.jsx';
import { TextInput } from '../ui/TextInput.jsx';

const buildDefaultCode = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  const formatted = toDateInputValue(date).replaceAll('-', '');
  return `REV-${formatted}-001`;
};

export const RevenueForm = ({
  mode,
  defaultValues,
  businessOptions,
  onSubmit,
  isSubmitting,
  onCancel,
  errorMessage,
  actions,
}) => {
  const initialValues = useMemo(() => ({
    businessId: defaultValues?.businessId || '',
    date: toDateInputValue(defaultValues?.date || defaultValues?.revenueDate || new Date()),
    code: defaultValues?.code || buildDefaultCode(defaultValues?.date || defaultValues?.revenueDate),
    content: defaultValues?.content || '',
    cashAmount: defaultValues?.cashAmount ?? 0,
    bankAmount: defaultValues?.bankAmount ?? 0,
    note: defaultValues?.note || '',
  }), [defaultValues]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(revenueSchema),
    values: initialValues,
  });

  const cashAmount = Number(watch('cashAmount') || 0);
  const bankAmount = Number(watch('bankAmount') || 0);
  const totalAmount = cashAmount + bankAmount;
  const documentCode = watch('code') || buildDefaultCode(watch('date'));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <FormError message={errorMessage} />

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Thông tin chung</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="businessId" className="mb-2 block text-sm font-medium text-slate-700">
                Hộ kinh doanh
              </label>
              <select
                id="businessId"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                {...register('businessId')}
              >
                <option value="">Chọn hộ kinh doanh</option>
                {businessOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
              {errors.businessId ? <p className="mt-2 text-sm text-red-600">{errors.businessId.message}</p> : null}
            </div>

            <TextInput
              id="date"
              type="date"
              label="Ngày ghi nhận"
              {...register('date')}
              error={errors.date?.message}
            />

            <TextInput
              id="code"
              label="Mã chứng từ"
              readOnly
              value={documentCode}
              inputClassName="bg-slate-50 text-slate-500"
            />

            <TextInput
              id="content"
              label="Nội dung doanh thu"
              placeholder="Nhập tóm tắt nội dung bán hàng..."
              {...register('content')}
              error={errors.content?.message}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Chi tiết dòng tiền</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextInput
              id="cashAmount"
              type="number"
              min="0"
              step="1000"
              label="Tiền mặt (VND)"
              {...register('cashAmount')}
              error={errors.cashAmount?.message}
            />

            <TextInput
              id="bankAmount"
              type="number"
              min="0"
              step="1000"
              label="Tiền tài khoản (VND)"
              {...register('bankAmount')}
              error={errors.bankAmount?.message}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-teal-50 px-4 py-4 text-sm text-teal-800">
            Tổng doanh thu hiện tại: <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Ghi chú bổ sung</h2>
          <textarea
            id="note"
            rows="5"
            placeholder="Nhập các lưu ý đặc biệt với đơn hàng hoặc giảm giá..."
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            {...register('note')}
          />
        </section>
      </div>

      <div className="space-y-4">
        {actions({ cashAmount, bankAmount, totalAmount, code: documentCode })}

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            {mode === 'create' ? 'Lưu dữ liệu' : 'Cập nhật dữ liệu'}
          </Button>
          <Button type="button" variant="secondary" fullWidth size="lg" onClick={onCancel} className="mt-3">
            Hủy bỏ
          </Button>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Dữ liệu sau khi lưu sẽ được cập nhật trực tiếp vào hệ thống và dùng cho báo cáo doanh thu.
          </p>
        </section>
      </div>
    </form>
  );
};
