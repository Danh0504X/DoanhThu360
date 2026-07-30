import { Icon } from '../dashboard/DashboardIcons.jsx';
import { Table } from '../ui/Table.jsx';
import { BusinessStatusBadge } from './BusinessStatusBadge.jsx';

const BusinessIcon = () => (
  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
    <Icon name="briefcase" className="h-5 w-5" />
  </div>
);

const MetaRow = ({ icon, children }) => (
  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-bone-500">
    <Icon name={icon} className="h-3.5 w-3.5 shrink-0 text-bone-400" />
    <span className="truncate">{children}</span>
  </p>
);

export const BusinessTable = ({
  rows,
  pagination,
  page,
  onPageChange,
  onEdit,
  onToggleStatus,
}) => {
  const mobileList = (
    <div className="space-y-3 p-3">
      {rows.map((business) => (
        <article key={business._id} className="rounded-md border border-bone-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <BusinessIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-bold text-bone-800">{business.businessName}</p>
                <BusinessStatusBadge status={business.status} />
              </div>
              <MetaRow icon="card">MST: {business.taxCode || 'Chưa cập nhật'}</MetaRow>
              <MetaRow icon="home">{business.address || 'Chưa cập nhật địa chỉ'}</MetaRow>
            </div>
          </div>

          <div className="mt-3 flex gap-2 border-t border-bone-100 pt-3">
            <button
              type="button"
              onClick={() => onEdit(business)}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-sm border border-bone-200 text-xs font-bold text-bone-600 transition-brand active:bg-bone-50"
            >
              Sửa
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(business)}
              className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-sm border text-xs font-bold transition-brand ${
                business.status === 'active'
                  ? 'border-red-200 text-red-500 active:bg-red-50'
                  : 'border-emerald-200 text-emerald-600 active:bg-emerald-50'
              }`}
            >
              {business.status === 'active' ? 'Ngừng' : 'Kích hoạt'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );

  const desktopTable = (
    <table className="min-w-full divide-y divide-bone-100 text-sm">
      <thead className="bg-bone-50 text-left text-xs font-bold uppercase text-bone-500">
        <tr>
          <th className="px-6 py-4">Tên hộ kinh doanh</th>
          <th className="px-6 py-4">Mã số thuế</th>
          <th className="px-6 py-4">Địa chỉ</th>
          <th className="px-6 py-4">Trạng thái</th>
          <th className="px-6 py-4 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-bone-100">
        {rows.map((business) => (
          <tr key={business._id} className="align-top transition-brand hover:bg-bone-50/80">
            <td className="px-6 py-5">
              <div className="flex items-start gap-3">
                <BusinessIcon />
                <div className="min-w-0">
                  <p className="font-bold text-bone-800">{business.businessName}</p>
                  <p className="mt-1 text-xs font-medium text-bone-500">
                    {business.email || business.phone || 'Chưa cập nhật liên hệ'}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-5 font-medium text-bone-600">{business.taxCode || 'Chưa cập nhật'}</td>
            <td className="max-w-xs px-6 py-5 font-medium text-bone-600">
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
                  className="grid h-9 w-9 place-items-center rounded-sm border border-bone-200 text-bone-500 transition-brand hover:bg-bone-50 hover:text-primary-600"
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
                  className={`grid h-9 w-9 place-items-center rounded-sm border transition-brand ${
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
  );

  return (
    <Table
      mobileList={mobileList}
      desktopTable={desktopTable}
      itemLabel="hộ kinh doanh"
      pagination={{ ...pagination, page: pagination?.page || page, onPageChange }}
    />
  );
};
