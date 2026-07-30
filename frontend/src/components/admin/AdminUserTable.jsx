import { Badge } from '../ui/Badge.jsx';
import { Table } from '../ui/Table.jsx';
import { formatDate } from '../../utils/formatDate.js';

const STATUS_TONE = {
  active: 'emerald',
  inactive: 'amber',
  banned: 'red',
};

const STATUS_LABEL = {
  active: 'Đang hoạt động',
  inactive: 'Ngừng hoạt động',
  banned: 'Bị chặn',
};

const ROLE_LABEL = {
  admin: 'Quản trị viên',
  user: 'Người dùng',
};

const UserIdentity = ({ user }) => (
  <div className="min-w-0">
    <p className="truncate font-bold text-bone-800">{user.name || user.username || 'Chưa đặt tên'}</p>
    <p className="mt-0.5 truncate text-xs font-medium text-bone-500">{user.email || user.username || '—'}</p>
  </div>
);

export const AdminUserTable = ({
  rows,
  pagination,
  page,
  onPageChange,
  onEdit,
  onToggleBlock,
  onDelete,
}) => {
  const mobileList = (
    <div className="space-y-3 p-3">
      {rows.map((user) => (
        <article key={user._id} className="rounded-md border border-bone-200 bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <UserIdentity user={user} />
            <Badge tone={STATUS_TONE[user.status] || 'neutral'}>{STATUS_LABEL[user.status] || user.status}</Badge>
          </div>
          <p className="mt-2 text-xs font-medium text-bone-500">
            {ROLE_LABEL[user.role] || user.role} · Tham gia {formatDate(user.createdAt)}
          </p>

          <div className="mt-3 flex gap-2 border-t border-bone-100 pt-3">
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-sm border border-bone-200 text-xs font-bold text-bone-600 transition-brand active:bg-bone-50"
            >
              Sửa
            </button>
            <button
              type="button"
              onClick={() => onToggleBlock(user)}
              className={`inline-flex h-9 flex-1 items-center justify-center rounded-sm border text-xs font-bold transition-brand ${
                user.status === 'banned'
                  ? 'border-emerald-200 text-emerald-600 active:bg-emerald-50'
                  : 'border-red-200 text-red-500 active:bg-red-50'
              }`}
            >
              {user.status === 'banned' ? 'Bỏ chặn' : 'Chặn'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(user)}
              className="inline-flex h-9 items-center justify-center rounded-sm border border-bone-200 px-3 text-xs font-bold text-bone-500 transition-brand active:bg-bone-50"
              aria-label="Xoá tài khoản"
            >
              Xoá
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
          <th className="px-6 py-4">Người dùng</th>
          <th className="px-6 py-4">Vai trò</th>
          <th className="px-6 py-4">Trạng thái</th>
          <th className="px-6 py-4">Ngày tham gia</th>
          <th className="px-6 py-4">Đăng nhập gần nhất</th>
          <th className="px-6 py-4 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-bone-100">
        {rows.map((user) => (
          <tr key={user._id} className="align-top transition-brand hover:bg-bone-50/80">
            <td className="px-6 py-5"><UserIdentity user={user} /></td>
            <td className="px-6 py-5 font-medium text-bone-600">{ROLE_LABEL[user.role] || user.role}</td>
            <td className="px-6 py-5">
              <Badge tone={STATUS_TONE[user.status] || 'neutral'}>{STATUS_LABEL[user.status] || user.status}</Badge>
            </td>
            <td className="px-6 py-5 font-medium text-bone-600">{formatDate(user.createdAt)}</td>
            <td className="px-6 py-5 font-medium text-bone-600">{user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}</td>
            <td className="px-6 py-5">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="rounded-sm border border-bone-200 px-3 py-1.5 text-xs font-bold text-bone-600 transition-brand hover:bg-bone-50 hover:text-primary-600"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onToggleBlock(user)}
                  className={`rounded-sm border px-3 py-1.5 text-xs font-bold transition-brand ${
                    user.status === 'banned'
                      ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      : 'border-red-200 text-red-500 hover:bg-red-50'
                  }`}
                >
                  {user.status === 'banned' ? 'Bỏ chặn' : 'Chặn'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  className="rounded-sm border border-bone-200 px-3 py-1.5 text-xs font-bold text-bone-500 transition-brand hover:bg-bone-50"
                >
                  Xoá
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
      itemLabel="người dùng"
      pagination={{ ...pagination, page: pagination?.page || page, onPageChange }}
    />
  );
};
