import { useMemo, useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Modal } from '../ui/Modal.jsx';
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      periodType,
      value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xuất sổ doanh thu ra Word"
      className="max-w-lg"
    >
      <p className="text-sm text-bone-500">
        {businessName ? `Hộ kinh doanh: ${businessName}` : 'Chọn kỳ xuất theo tháng hoặc năm.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setPeriodType('month');
              setValue('');
            }}
            className={`rounded-sm border px-4 py-4 text-left transition-brand ${
              periodType === 'month'
                ? 'border-primary-700 bg-primary-50 text-primary-800'
                : 'border-bone-200 text-bone-600 hover:bg-bone-50'
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
            className={`rounded-sm border px-4 py-4 text-left transition-brand ${
              periodType === 'year'
                ? 'border-primary-700 bg-primary-50 text-primary-800'
                : 'border-bone-200 text-bone-600 hover:bg-bone-50'
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
    </Modal>
  );
};
