import { BUSINESS_TYPE_OPTIONS } from '../../schemas/businessSchema.js';
import { BusinessStatusBadge } from './BusinessStatusBadge.jsx';

const businessTypeLabelMap = Object.fromEntries(
  BUSINESS_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const BusinessIcon = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 21h14" />
      <path d="M7 21V7l5-3 5 3v14" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  </div>
);

export const BusinessTable = ({
  rows,
  pagination,
  page,
  onPageChange,
  onEdit,
  onToggleStatus,
}) => {
  const total = pagination?.total || 0;
  const currentPage = pagination?.page || page || 1;
  const limit = pagination?.limit || 10;
  const start = total ? (currentPage - 1) * limit + 1 : 0;
  const end = Math.min(currentPage * limit, total);
  const totalPages = pagination?.totalPages || 1;

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-6 py-4">Tên hộ kinh doanh</th>
              <th className="px-6 py-4">Mã số thuế</th>
              <th className="px-6 py-4">Loại hình</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((business) => (
              <tr key={business._id} className="align-top">
                <td className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <BusinessIcon />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{business.businessName}</p>
                      <p className="mt-1 text-xs text-slate-500">{business.email || business.phone || 'Chưa cập nhật liên hệ'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-600">{business.taxCode || 'Chưa cập nhật'}</td>
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {businessTypeLabelMap[business.businessType] || 'Khác'}
                  </span>
                </td>
                <td className="max-w-xs px-6 py-5 text-slate-600">
                  <span className="line-clamp-2">{business.address || 'Chưa cập nhật'}</span>
                </td>
                <td className="px-6 py-5">
                  <BusinessStatusBadge status={business.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(business)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                      aria-label="Sửa hộ kinh doanh"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                        <path d="m12 6 4 4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(business)}
                      className={`rounded-xl border p-2 transition ${
                        business.status === 'active'
                          ? 'border-red-200 text-red-500 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      aria-label={business.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt lại'}
                    >
                      {business.status === 'active' ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="8" />
                          <path d="M8 16 16 8" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="m8 12 3 3 5-6" />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Hiển thị {start} - {end} trên tổng số {total} hộ kinh doanh
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 3).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                currentPage === pageNumber
                  ? 'bg-teal-700 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};
