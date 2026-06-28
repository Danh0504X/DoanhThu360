import { useMemo, useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { TextInput } from '../ui/TextInput.jsx';

export const RevenueWordExportDialog = ({
  isOpen,
  businessName,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [periodType, setPeriodType] = useState('month');
  const [value, setValue] = useState('');

  const inputType = useMemo(() => (periodType === 'month' ? 'month' : 'number'), [periodType]);
  const placeholder = periodType === 'month' ? '' : '2026';

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      periodType,
      value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Xuất sổ doanh thu ra Word</h2>
            <p className="mt-2 text-sm text-slate-500">
              {businessName ? `Hộ kinh doanh: ${businessName}` : 'Chọn kỳ xuất theo tháng hoặc năm.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setPeriodType('month');
                setValue('');
              }}
              className={`border px-4 py-4 text-left transition ${
                periodType === 'month'
                  ? 'border-teal-700 bg-teal-50 text-teal-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-semibold">Theo tháng</p>
              <p className="mt-1 text-xs opacity-80">Ví dụ 04/2026</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setPeriodType('year');
                setValue('');
              }}
              className={`border px-4 py-4 text-left transition ${
                periodType === 'year'
                  ? 'border-teal-700 bg-teal-50 text-teal-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-semibold">Theo năm</p>
              <p className="mt-1 text-xs opacity-80">Ví dụ 2026</p>
            </button>
          </div>

          <TextInput
            id="revenue-word-period-value"
            label={periodType === 'month' ? 'Chọn tháng' : 'Chọn năm'}
            type={inputType}
            min={periodType === 'year' ? '2000' : undefined}
            max={periodType === 'year' ? '2100' : undefined}
            step={periodType === 'year' ? '1' : undefined}
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!value}>
              Xuất Word
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
