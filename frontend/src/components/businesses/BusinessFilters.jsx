import { BUSINESS_STATUS_OPTIONS, BUSINESS_TYPE_OPTIONS } from '../../schemas/businessSchema.js';

export const BusinessFilters = ({ filters, onChange }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_220px_220px]">
      <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Tìm kiếm nhanh
        </span>
        <input
          type="text"
          value={filters.keyword}
          onChange={(event) => onChange('keyword', event.target.value)}
          placeholder="Tên hộ, MST hoặc Địa chỉ..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>

      <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Trạng thái
        </span>
        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
        >
          {BUSINESS_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Loại hình
        </span>
        <select
          value={filters.type}
          onChange={(event) => onChange('type', event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
        >
          <option value="all">Tất cả</option>
          {BUSINESS_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>
  </section>
);
