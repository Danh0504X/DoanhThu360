import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { FormError } from '../ui/FormError.jsx';
import { revenueSchema } from '../../schemas/revenue.schema.js';
import { toDateInputValue } from '../../utils/formatDate.js';

const inputBase =
  'h-12 w-full rounded-md border border-bone-100 bg-bone-100 px-4 text-sm font-semibold text-bone-800 outline-none transition-brand focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-50 placeholder:text-bone-400';

const labelBase = 'mb-2 block text-xs font-bold uppercase tracking-normal text-bone-600';

const FieldError = ({ message }) => (
  message ? <p className="mt-2 text-sm font-semibold text-red-600">{message}</p> : null
);

// Nhóm chữ số bằng dấu chấm: "3000000" -> "3.000.000"
const groupThousands = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Nhãn rút gọn kiểu Việt: 3000000 -> "3tr", 1500000000 -> "1,5 tỷ", 500000 -> "500k"
const shortMoney = (num) => {
  if (!num) return '';
  const trim = (value) => value.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  if (num >= 1_000_000_000) return `${trim(num / 1_000_000_000)} tỷ`;
  if (num >= 1_000_000) return `${trim(num / 1_000_000)}tr`;
  if (num >= 1_000) return `${trim(num / 1_000)}k`;
  return `${num}`;
};

const QUICK_ADDS = [
  { label: '+100k', value: 100_000 },
  { label: '+500k', value: 500_000 },
  { label: '+1tr', value: 1_000_000 },
];

const MAX_MONEY = 999_999_999_999;

const MoneyInput = ({ id, label, value, onChange, error, icon, autoFocus }) => {
  // Lưu/hiển thị thuần chữ số; định dạng chỉ ở phần nhìn để schema vẫn nhận số sạch.
  const digits = value == null ? '' : String(value).replace(/\D/g, '');
  const numeric = digits ? Number(digits) : 0;

  const handleChange = (event) => {
    onChange(event.target.value.replace(/\D/g, '').slice(0, 12));
  };

  const addAmount = (amount) => onChange(String(Math.min(numeric + amount, MAX_MONEY)));
  const clear = () => onChange('');

  return (
    <div>
      <label htmlFor={id} className={labelBase}>{label}</label>
      <div className="relative">
        {icon ? (
          <Icon name={icon} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" />
        ) : null}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Nhập số tiền"
          value={groupThousands(digits)}
          onChange={handleChange}
          className={`${inputBase} text-lg ${icon ? 'pl-12' : ''} ${digits ? 'pr-20' : 'pr-16'}`}
        />
        {digits ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Xóa số tiền"
            className="absolute right-12 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-bone-200 text-bone-500 transition-brand hover:bg-bone-300 hover:text-bone-700"
          >
            <Icon name="plus" className="h-3.5 w-3.5 rotate-45" />
          </button>
        ) : null}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-bone-400">
          VND
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {QUICK_ADDS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => addAmount(preset.value)}
            className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600 transition-brand hover:bg-primary-100 active:scale-95"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {digits ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-serif text-lg font-semibold tracking-tight text-primary-600">
            {groupThousands(digits)} ₫
          </span>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-600">
            ≈ {shortMoney(numeric)}
          </span>
        </div>
      ) : (
        <p className="mt-2 text-xs font-medium text-bone-400">
          Nhập số tiền — hệ thống tự hiển thị lại cho dễ kiểm tra.
        </p>
      )}
      <FieldError message={error} />
    </div>
  );
};

const PAYMENT_MODES = [
  { id: 'cash', label: 'Tiền mặt', icon: 'cash' },
  { id: 'bank', label: 'Tài khoản', icon: 'bank' },
  { id: 'split', label: 'Cả hai', icon: 'wallet' },
];

const resolvePaymentMode = (cashAmount, bankAmount) => {
  const cash = Number(cashAmount || 0);
  const bank = Number(bankAmount || 0);
  if (cash > 0 && bank > 0) return 'split';
  if (bank > 0 && cash <= 0) return 'bank';
  return 'cash';
};

const PaymentModeToggle = ({ mode, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {PAYMENT_MODES.map((option) => (
      <button
        key={option.id}
        type="button"
        onClick={() => onChange(option.id)}
        className={`flex flex-col items-center gap-1.5 rounded-md border py-3 text-xs font-bold transition-brand ${
          mode === option.id
            ? 'border-primary-600 bg-primary-50 text-primary-800'
            : 'border-bone-200 bg-white text-bone-500 hover:bg-bone-50'
        }`}
      >
        <Icon name={option.icon} className="h-5 w-5" />
        {option.label}
      </button>
    ))}
  </div>
);

const CONTENT_PRESETS = [
  'Bán lẻ cho khách',
  'Bán sỉ',
  'Thu tiền dịch vụ',
  'Chuyển khoản khách hàng',
  'Hoàn tiền / hoàn hàng',
];

const QUICK_DATES = [
  { label: 'Hôm nay', offset: 0 },
  { label: 'Hôm qua', offset: -1 },
];

const isSameDay = (dateValue, offset) => {
  const target = new Date();
  target.setDate(target.getDate() + offset);
  return dateValue === toDateInputValue(target);
};

const BusinessPicker = ({ options, value, onChange, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 5;
  const visibleOptions = showAll ? options : options.slice(0, visibleCount);
  const hiddenCount = options.length - visibleOptions.length;

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((key) => (
          <span key={key} className="h-9 w-24 animate-pulse rounded-full bg-bone-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full border px-4 py-2 text-sm font-bold transition-brand ${
            value === option.id
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-bone-200 bg-white text-bone-600 hover:bg-bone-50'
          }`}
        >
          {option.name}
        </button>
      ))}
      {!showAll && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="rounded-full border border-dashed border-bone-300 px-4 py-2 text-sm font-bold text-bone-500 transition-brand hover:bg-bone-50"
        >
          +{hiddenCount} khác
        </button>
      ) : null}
    </div>
  );
};

const DesktopInfoCards = () => {
  const cards = [
    {
      title: 'Chính xác',
      icon: 'shield',
      tone: 'bg-primary-100 text-primary-800',
      description: 'Vui lòng kiểm tra kỹ số tiền mặt và tiền tài khoản trước khi lưu để tránh sai sót kế toán.',
    },
    {
      title: 'Lịch sử',
      icon: 'history',
      tone: 'bg-blue-100 text-bone-700',
      description: 'Các bảng ghi sau khi lưu sẽ xuất hiện ngay lập tức trong phần Phân tích Dòng tiền.',
    },
    {
      title: 'Trợ giúp',
      icon: 'settings',
      tone: 'bg-indigo-100 text-bone-700',
      description: 'Liên hệ đội ngũ hỗ trợ kỹ thuật nếu bạn gặp lỗi trong quá trình đồng bộ dữ liệu.',
    },
  ];

  return (
    <div className="mt-8 hidden grid-cols-3 gap-6 lg:grid">
      {cards.map((card) => (
        <article key={card.title} className="rounded-md border border-bone-200 bg-white p-6">
          <span className={`grid h-10 w-10 place-items-center rounded-md ${card.tone}`}>
            <Icon name={card.icon} className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-base font-bold text-bone-900">{card.title}</h3>
          <p className="mt-3 text-sm leading-6 text-bone-500">{card.description}</p>
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
        cashAmount: initialValues.cashAmount != null ? String(initialValues.cashAmount) : '',
        bankAmount: initialValues.bankAmount != null ? String(initialValues.bankAmount) : '',
        content: initialValues.content || '',
        note: initialValues.note || '',
      };
    }

    return {
      businessId: defaultBusinessId,
      date: toDateInputValue(new Date()),
      cashAmount: '',
      bankAmount: '',
      content: DEFAULT_CONTENT,
      note: '',
    };
  }, [initialValues, defaultBusinessId]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(revenueSchema),
    values: defaultValues,
  });

  const [paymentMode, setPaymentMode] = useState(() =>
    resolvePaymentMode(defaultValues.cashAmount, defaultValues.bankAmount));
  const [isNoteOpen, setIsNoteOpen] = useState(() => Boolean(defaultValues.note));
  const dateValue = watch('date');

  // Keep the payment-mode toggle and note visibility in sync when editing
  // a different record (defaultValues identity changes once the query resolves).
  useEffect(() => {
    setPaymentMode(resolvePaymentMode(defaultValues.cashAmount, defaultValues.bankAmount));
    setIsNoteOpen(Boolean(defaultValues.note));
  }, [defaultValues]);

  const handlePaymentModeChange = (nextMode) => {
    setPaymentMode(nextMode);
    if (nextMode === 'cash') setValue('bankAmount', '');
    if (nextMode === 'bank') setValue('cashAmount', '');
  };

  const handleQuickDate = (offset) => {
    const target = new Date();
    target.setDate(target.getDate() + offset);
    setValue('date', toDateInputValue(target));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={isMobile ? 'bg-transparent' : 'rounded-lg border border-bone-200 bg-white'}>
        {!isMobile ? (
          <div className="border-b border-bone-200 px-5 py-5 lg:px-7">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-bone-900">{title}</h1>
            <p className="mt-2 text-sm font-medium text-bone-500">{subtitle}</p>
          </div>
        ) : null}

        <div className={isMobile ? 'space-y-6' : 'space-y-6 px-5 py-6 lg:px-7'}>
          <FormError message={submitError || businessError} className="rounded-md" />

          <div>
            <label className={labelBase}>Hộ kinh doanh</label>
            <Controller
              control={control}
              name="businessId"
              render={({ field }) => (
                <BusinessPicker
                  options={businessOptions}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={isBusinessLoading}
                />
              )}
            />
            <FieldError message={errors.businessId?.message} />
          </div>

          <div>
            <label htmlFor="date" className={labelBase}>Ngày ghi nhận</label>
            <div className="flex items-center gap-2">
              {QUICK_DATES.map((quick) => (
                <button
                  key={quick.label}
                  type="button"
                  onClick={() => handleQuickDate(quick.offset)}
                  className={`h-10 shrink-0 rounded-md border px-3 text-xs font-bold transition-brand ${
                    isSameDay(dateValue, quick.offset)
                      ? 'border-primary-600 bg-primary-50 text-primary-800'
                      : 'border-bone-200 bg-white text-bone-600 hover:bg-bone-50'
                  }`}
                >
                  {quick.label}
                </button>
              ))}
              <div className="relative flex-1">
                <input id="date" type="date" className={`${inputBase} pr-12`} {...register('date')} />
                <Icon name="calendar" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" />
              </div>
            </div>
            <FieldError message={errors.date?.message} />
          </div>

          <div>
            <label className={labelBase}>Hình thức thanh toán</label>
            <PaymentModeToggle mode={paymentMode} onChange={handlePaymentModeChange} />
          </div>

          <div className={`grid gap-5 ${paymentMode === 'split' ? 'lg:grid-cols-2' : ''}`}>
            {paymentMode !== 'bank' ? (
              <Controller
                control={control}
                name="cashAmount"
                render={({ field }) => (
                  <MoneyInput
                    id="cashAmount"
                    label="Số tiền mặt nhận"
                    icon="wallet"
                    autoFocus={!isMobile}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.cashAmount?.message}
                  />
                )}
              />
            ) : null}

            {paymentMode !== 'cash' ? (
              <Controller
                control={control}
                name="bankAmount"
                render={({ field }) => (
                  <MoneyInput
                    id="bankAmount"
                    label="Số tiền vào tài khoản"
                    icon="bank"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.bankAmount?.message}
                  />
                )}
              />
            ) : null}
          </div>

          <div>
            <label htmlFor="content" className={labelBase}>Nội dung bảng ghi</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {CONTENT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue('content', preset)}
                  className="rounded-full border border-bone-200 bg-white px-3 py-1.5 text-xs font-bold text-bone-600 transition-brand hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              id="content"
              rows="3"
              placeholder="Nhập mô tả chi tiết về giao dịch hoặc các lưu ý kèm theo..."
              className="w-full resize-none rounded-md border border-bone-100 bg-bone-100 px-4 py-4 text-sm font-medium text-bone-800 outline-none transition-brand placeholder:text-bone-400 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-50"
              {...register('content')}
            />
            <FieldError message={errors.content?.message} />
          </div>

          {isNoteOpen ? (
            <div>
              <label htmlFor="note" className={labelBase}>Ghi chú (tùy chọn)</label>
              <textarea
                id="note"
                rows="3"
                placeholder="Ghi chú nội bộ về giảm giá, khách hàng..."
                className="w-full resize-none rounded-md border border-bone-100 bg-bone-100 px-4 py-4 text-sm font-medium text-bone-800 outline-none transition-brand placeholder:text-bone-400 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-50"
                {...register('note')}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsNoteOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bone-500 transition-brand hover:text-primary-700"
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              Thêm ghi chú
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-bold text-bone-500">
            <Icon name="shield" className="h-4 w-4 text-bone-400" />
            Mọi thông tin sẽ được mã hóa bảo mật 256-bit
          </div>
        </div>

        <div className={`${isMobile ? 'hidden' : 'hidden items-center justify-end gap-4 border-t border-bone-200 bg-bone-50 px-7 py-5 lg:flex'}`}>
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-md border border-bone-200 bg-white px-8 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary-600 px-8 text-sm font-bold text-white transition-brand hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="save" className="h-4 w-4" />}
            {submitText}
          </button>
        </div>
      </section>

      <DesktopInfoCards />

      <div className="h-28 lg:hidden" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bone-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 lg:hidden">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary-600 text-sm font-bold text-white transition-brand hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="save" className="h-4 w-4" />}
          {submitText}
        </button>
      </div>
    </form>
  );
};
