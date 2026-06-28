import { TextInput } from '../ui/TextInput.jsx';

const QUICK_PERIODS = [
  { id: 'week', label: 'Tuần này' },
  { id: 'month', label: 'Tháng này' },
];

export const RevenueFilters = ({
  filters,
  onChange,
  businessOptions,
  activePeriod = null,
  onPeriodSelect = () => {},
}) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Khoảng thời gian</p>
      <div className="flex items-center gap-2">
        {QUICK_PERIODS.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => onPeriodSelect(period.id)}
            className={`h-9 rounded-md px-4 text-sm font-bold transition ${
              activePeriod === period.id
                ? 'bg-teal-700 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>

    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1fr]">
      <TextInput
        id="revenue-keyword"
        label="Tìm kiếm nội dung"
        placeholder="Nhập từ khóa tìm kiếm..."
        value={filters.keyword}
        onChange={(event) => onChange('keyword', event.target.value)}
      />

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

      <div>
        <label htmlFor="revenue-business-filter" className="mb-2 block text-sm font-medium text-slate-700">
          Hộ kinh doanh
        </label>
        <select
          id="revenue-business-filter"
          value={filters.businessId}
          onChange={(event) => onChange('businessId', event.target.value)}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        >
          {businessOptions.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </div>
    </div>
  </section>
);
