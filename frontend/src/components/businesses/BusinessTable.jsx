import { Icon } from '../dashboard/DashboardIcons.jsx';
import { BusinessStatusBadge } from './BusinessStatusBadge.jsx';

const BusinessIcon = () => (
  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-50 text-[#2D7A7F]">
    <Icon name="briefcase" className="h-5 w-5" />
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
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {/* Mobile: card list */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {rows.map((business) => (
          <article key={business._id} className="flex items-start gap-3 p-4">
            <BusinessIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-bold text-slate-900">{business.businessName}</p>
                <BusinessStatusBadge status={business.status} />
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">
                MST: {business.taxCode || 'Chưa cập nhật'}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 line-clamp-2">
                {business.address || 'Chưa cập nhật địa chỉ'}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(business)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-600 transition active:bg-slate-50"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStatus(business)}
                  className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-bold transition ${
                    business.status === 'active'
                      ? 'border-red-200 text-red-500 active:bg-red-50'
                      : 'border-emerald-200 text-emerald-600 active:bg-emerald-50'
                  }`}
                >
                  {business.status === 'active' ? 'Ngừng' : 'Kích hoạt'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Tên hộ kinh doanh</th>
              <th className="px-6 py-4">Mã số thuế</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((business) => (
              <tr key={business._id} className="align-top transition hover:bg-slate-50/80">
                <td className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <BusinessIcon />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{business.businessName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {business.email || business.phone || 'Chưa cập nhật liên hệ'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-medium text-slate-600">{business.taxCode || 'Chưa cập nhật'}</td>
                <td className="max-w-xs px-6 py-5 font-medium text-slate-600">
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
                      className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#2D7A7F]"
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
                      className={`grid h-9 w-9 place-items-center rounded-md border transition ${
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
        <p className="text-sm font-medium text-slate-500">
          Hiển thị {start} - {end} trên tổng số {total} hộ kinh doanh
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 3).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                currentPage === pageNumber
                  ? 'bg-[#2D7A7F] text-white'
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
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};
