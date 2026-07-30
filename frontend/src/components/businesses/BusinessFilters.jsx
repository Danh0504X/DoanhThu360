import { Card } from '../ui/Card.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { BUSINESS_STATUS_OPTIONS } from '../../schemas/business.schema.js';

export const BusinessFilters = ({ filters, onChange }) => (
  <Card padding="lg">
    <label className="relative block">
      <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-bone-400" />
      <input
        type="text"
        value={filters.keyword}
        onChange={(event) => onChange('keyword', event.target.value)}
        placeholder="Tên hộ, MST hoặc địa chỉ..."
        className="h-12 w-full rounded-sm border border-bone-100 bg-bone-100 pl-11 pr-4 text-sm font-semibold text-bone-800 outline-none transition-brand placeholder:text-bone-400 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-50"
      />
    </label>

    <div className="mt-4 flex flex-wrap gap-2">
      {BUSINESS_STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange('status', option.value)}
          className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-brand ${
            filters.status === option.value
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-bone-200 bg-white text-bone-600 hover:bg-bone-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </Card>
);
