import { BUSINESS_STATUS_OPTIONS } from '../../schemas/businessSchema.js';

export const BusinessFilters = ({ filters, onChange }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_240px]">
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
          Tìm kiếm nhanh
        </span>
        <input
          type="text"
          value={filters.keyword}
          onChange={(event) => onChange('keyword', event.target.value)}
          placeholder="Tên hộ, MST hoặc địa chỉ..."
          className="h-12 w-full rounded-md border border-slate-100 bg-slate-100 px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
          Trạng thái
        </span>
        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          className="h-12 w-full rounded-md border border-slate-100 bg-slate-100 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#2D7A7F] focus:bg-white focus:ring-2 focus:ring-teal-50"
        >
          {BUSINESS_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>
  </section>
);
