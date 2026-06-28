import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { FormError } from '../ui/FormError.jsx';
import { revenueSchema } from '../../schemas/revenueSchema.js';
import { toDateInputValue } from '../../utils/formatDate.js';

const inputBase =
  'h-12 w-full rounded-md border border-slate-100 bg-slate-100 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50 placeholder:text-slate-400';

const labelBase = 'mb-2 block text-xs font-bold uppercase tracking-normal text-slate-600';

const FieldError = ({ message }) => (
  message ? <p className="mt-2 text-sm font-semibold text-red-600">{message}</p> : null
);

const MoneyInput = ({ id, label, register, error }) => (
  <div>
    <label htmlFor={id} className={labelBase}>{label}</label>
    <div className="relative">
      <input
        id={id}
        type="number"
        min="0"
        step="1000"
        inputMode="numeric"
        placeholder="0"
        className={`${inputBase} pr-16`}
        {...register(id)}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
        VND
      </span>
    </div>
    <FieldError message={error} />
  </div>
);

const DesktopInfoCards = () => {
  const cards = [
    {
      title: 'Chính xác',
      icon: 'shield',
      tone: 'bg-teal-100 text-teal-800',
      description: 'Vui lòng kiểm tra kỹ số tiền mặt và tiền tài khoản trước khi lưu để tránh sai sót kế toán.',
    },
    {
      title: 'Lịch sử',
      icon: 'history',
      tone: 'bg-blue-100 text-slate-700',
      description: 'Các bảng ghi sau khi lưu sẽ xuất hiện ngay lập tức trong phần Phân tích Dòng tiền.',
    },
    {
      title: 'Trợ giúp',
      icon: 'settings',
      tone: 'bg-indigo-100 text-slate-700',
      description: 'Liên hệ đội ngũ hỗ trợ kỹ thuật nếu bạn gặp lỗi trong quá trình đồng bộ dữ liệu.',
    },
  ];

  return (
    <div className="mt-8 hidden grid-cols-3 gap-6 lg:grid">
      {cards.map((card) => (
        <article key={card.title} className="rounded-md border border-slate-200 bg-white p-6">
          <span className={`grid h-10 w-10 place-items-center rounded-md ${card.tone}`}>
            <Icon name={card.icon} className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-base font-bold text-slate-900">{card.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{card.description}</p>
        </article>
      ))}
    </div>
  );
};

const DEFAULT_CONTENT = 'Bán Hàng Cho Khách Bán Lẻ';

export const RevenueRecordCreateForm = ({
  businessOptions = [],
  defaultBusinessId = '',
  initialValues = null,
  mode = 'create',
  title = 'Thêm mới bảng ghi',
  subtitle = 'Nhập thông tin giao dịch tài chính mới vào hệ thống quản trị.',
  submitLabel,
  isBusinessLoading,
  businessError,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
  variant = 'desktop',
}) => {
  const isMobile = variant === 'mobile';
  const submitText = submitLabel || (mode === 'edit' ? 'Cập nhật bảng ghi' : 'Lưu bảng ghi');
  const defaultValues = useMemo(() => {
    if (initialValues) {
      return {
        businessId: initialValues.businessId || '',
        date: toDateInputValue(initialValues.date || initialValues.revenueDate || new Date()),
        cashAmount: initialValues.cashAmount ?? 0,
        bankAmount: initialValues.bankAmount ?? 0,
        content: initialValues.content || '',
        note: initialValues.note || '',
      };
    }

    return {
      businessId: defaultBusinessId,
      date: toDateInputValue(new Date()),
      cashAmount: 0,
      bankAmount: 0,
      content: DEFAULT_CONTENT,
      note: '',
    };
  }, [initialValues, defaultBusinessId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(revenueSchema),
    values: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={isMobile ? 'bg-transparent' : 'rounded-lg border border-slate-200 bg-white'}>
        {!isMobile ? (
          <div className="border-b border-slate-200 px-5 py-5 lg:px-7">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
          </div>
        ) : null}

        <div className={isMobile ? 'space-y-6' : 'space-y-6 px-5 py-6 lg:px-7'}>
          <FormError message={submitError || businessError} className="rounded-md" />

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="businessId" className={labelBase}>Hộ kinh doanh</label>
              <div className="relative">
                <select
                  id="businessId"
                  className={`${inputBase} appearance-none pr-10`}
                  disabled={isBusinessLoading || !businessOptions.length}
                  {...register('businessId')}
                >
                  <option value="">
                    {isBusinessLoading ? 'Đang tải hộ kinh doanh...' : 'Chọn hộ kinh doanh'}
                  </option>
                  {businessOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <Icon name="chevronRight" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
              </div>
              <FieldError message={errors.businessId?.message} />
            </div>

            <div>
              <label htmlFor="date" className={labelBase}>Ngày ghi nhận</label>
              <div className="relative">
                <input id="date" type="date" className={`${inputBase} pr-12`} {...register('date')} />
                <Icon name="calendar" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D7A7F]" />
              </div>
              <FieldError message={errors.date?.message} />
            </div>

            <MoneyInput
              id="cashAmount"
              label="Tổng số tiền mặt nhận"
              register={register}
              error={errors.cashAmount?.message}
            />

            <MoneyInput
              id="bankAmount"
              label="Tổng số tiền tài khoản nhận"
              register={register}
              error={errors.bankAmount?.message}
            />

            <div className="lg:col-span-2">
              <label htmlFor="content" className={labelBase}>Nội dung bảng ghi</label>
              <textarea
                id="content"
                rows="4"
                placeholder="Nhập mô tả chi tiết về giao dịch hoặc các lưu ý kèm theo..."
                className="w-full resize-none rounded-md border border-slate-100 bg-slate-100 px-4 py-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50"
                {...register('content')}
              />
              <FieldError message={errors.content?.message} />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="note" className={labelBase}>Ghi chú (tùy chọn)</label>
              <textarea
                id="note"
                rows="3"
                placeholder="Ghi chú nội bộ về giảm giá, khách hàng..."
                className="w-full resize-none rounded-md border border-slate-100 bg-slate-100 px-4 py-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50"
                {...register('note')}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Icon name="shield" className="h-4 w-4 text-slate-400" />
            Mọi thông tin sẽ được mã hóa bảo mật 256-bit
          </div>
        </div>

        <div className={`${isMobile ? 'hidden' : 'hidden items-center justify-end gap-4 border-t border-slate-200 bg-slate-50 px-7 py-5 lg:flex'}`}>
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-md border border-slate-200 bg-white px-8 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2D7A7F] px-8 text-sm font-bold text-white transition hover:bg-[#25696d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="save" className="h-4 w-4" />}
            {submitText}
          </button>
        </div>
      </section>

      <DesktopInfoCards />

      <div className="h-28 lg:hidden" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 lg:hidden">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2D7A7F] text-sm font-bold text-white transition hover:bg-[#25696d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="save" className="h-4 w-4" />}
          {submitText}
        </button>
      </div>
    </form>
  );
};
