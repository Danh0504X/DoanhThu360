import { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { Modal } from '../ui/Modal.jsx';
import { TextInput } from '../ui/TextInput.jsx';

const QUICK_PERIODS = [
  { id: 'week', label: 'Tuần này' },
  { id: 'month', label: 'Tháng này' },
];

const BusinessPills = ({ options, value, onChange }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 4;
  const visible = showAll ? options : options.slice(0, visibleCount);
  const hidden = options.length - visible.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition-brand ${
            value === option.id
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-bone-200 bg-white text-bone-600 hover:bg-bone-50'
          }`}
        >
          {option.name}
        </button>
      ))}
      {!showAll && hidden > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="rounded-full border border-dashed border-bone-300 px-3.5 py-1.5 text-sm font-bold text-bone-500 transition-brand hover:bg-bone-50"
        >
          +{hidden} khác
        </button>
      ) : null}
    </div>
  );
};

export const RevenueFilters = ({
  filters,
  onChange,
  businessOptions,
  activePeriod = null,
  onPeriodSelect = () => {},
}) => {
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const dateFields = (
    <>
      <TextInput
        id="revenue-from-date"
        label="Từ ngày"
        type="date"
        value={filters.fromDate}
        onChange={(event) => onChange('fromDate', event.target.value)}
      />
      <TextInput
        id="revenue-to-date"
        label="Đến ngày"
        type="date"
        value={filters.toDate}
        onChange={(event) => onChange('toDate', event.target.value)}
      />
      <TextInput
        id="revenue-keyword"
        label="Tìm kiếm nội dung"
        placeholder="Nhập từ khóa tìm kiếm..."
        value={filters.keyword}
        onChange={(event) => onChange('keyword', event.target.value)}
      />
    </>
  );

  return (
    <Card padding="lg">
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-bone-400">Hộ kinh doanh</p>
        <BusinessPills
          options={businessOptions}
          value={filters.businessId}
          onChange={(value) => onChange('businessId', value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {QUICK_PERIODS.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => onPeriodSelect(period.id)}
              className={`h-9 rounded-md px-4 text-sm font-bold transition-brand ${
                activePeriod === period.id
                  ? 'bg-primary-700 text-white'
                  : 'border border-bone-200 bg-white text-bone-600 hover:bg-bone-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Desktop: date range + search inline */}
        <div className="hidden gap-3 lg:grid lg:grid-cols-3">
          {dateFields}
        </div>

        {/* Mobile: collapse date range + search into a modal */}
        <button
          type="button"
          onClick={() => setIsMoreFiltersOpen(true)}
          className="h-9 rounded-md border border-bone-200 bg-white px-4 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-50 lg:hidden"
        >
          Lọc thêm
        </button>
      </div>

      <Modal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
        title="Lọc thêm"
        footer={(
          <button
            type="button"
            onClick={() => setIsMoreFiltersOpen(false)}
            className="col-span-2 h-11 rounded-md bg-primary-600 text-sm font-bold text-white transition-brand hover:bg-primary-700"
          >
            Áp dụng
          </button>
        )}
      >
        <div className="space-y-5">{dateFields}</div>
      </Modal>
    </Card>
  );
};
