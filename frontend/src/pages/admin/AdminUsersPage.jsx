import { useMemo, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { AdminUserTable } from '../../components/admin/AdminUserTable.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { TextInput } from '../../components/ui/TextInput.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/useToast.js';
import {
  useAdminUpdateUserRoleStatus,
  useAdminUsers,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from '../../hooks/useAdmin.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { toDateInputValue } from '../../utils/formatDate.js';

const ROLE_OPTIONS = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'user', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị viên' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
  { value: 'banned', label: 'Bị chặn' },
];

const EditUserModal = ({ user, onClose, onSubmit, isSubmitting, errorMessage }) => {
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    gender: user?.gender || 'Other',
    dob: toDateInputValue(user?.dob),
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={Boolean(user)} onClose={onClose} title="Sửa thông tin người dùng">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={errorMessage} />
        <TextInput
          id="admin-edit-name"
          label="Họ tên"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <Select
          id="admin-edit-gender"
          label="Giới tính"
          value={form.gender}
          onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
        >
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
          <option value="Other">Khác</option>
        </Select>
        <TextInput
          id="admin-edit-dob"
          type="date"
          label="Ngày sinh"
          value={form.dob}
          onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))}
        />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const AdminUsersPage = () => {
  const toast = useToast();
  const [filters, setFilters] = useState({ keyword: '', role: 'all', status: 'all', page: 1, limit: 10 });
  const [editingUser, setEditingUser] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editError, setEditError] = useState('');
  const [actionError, setActionError] = useState('');

  const debouncedKeyword = useDebouncedValue(filters.keyword);
  const queryParams = useMemo(() => ({ ...filters, keyword: debouncedKeyword }), [filters, debouncedKeyword]);

  const usersQuery = useAdminUsers(queryParams);
  const updateUserMutation = useUpdateAdminUser();
  const toggleStatusMutation = useAdminUpdateUserRoleStatus();
  const deleteUserMutation = useDeleteAdminUser();

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value, page: field === 'page' ? value : 1 }));
  };

  const handleEditSubmit = async (values) => {
    try {
      setEditError('');
      await updateUserMutation.mutateAsync({ id: editingUser._id, data: values });
      toast.success('Cập nhật người dùng thành công');
      setEditingUser(null);
    } catch (error) {
      setEditError(error.message || 'Không thể cập nhật người dùng');
    }
  };

  const handleToggleBlockConfirm = async () => {
    if (!blockTarget) return;
    const nextStatus = blockTarget.status === 'banned' ? 'active' : 'banned';

    try {
      setActionError('');
      await toggleStatusMutation.mutateAsync({ id: blockTarget._id, data: { status: nextStatus } });
      toast.success(nextStatus === 'banned' ? 'Đã chặn tài khoản' : 'Đã bỏ chặn tài khoản');
      setBlockTarget(null);
    } catch (error) {
      setActionError(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setActionError('');
      await deleteUserMutation.mutateAsync(deleteTarget._id);
      toast.success('Đã xoá tài khoản');
      setDeleteTarget(null);
    } catch (error) {
      setActionError(error.message || 'Không thể xoá tài khoản');
    }
  };

  const rows = usersQuery.data?.rows || [];
  const pagination = usersQuery.data?.pagination;

  return (
    <AdminLayout activeNav="users">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-bone-950">Người dùng</h1>
          <p className="mt-1 text-sm text-bone-500">Quản lý, giám sát và xử lý tài khoản người dùng.</p>
        </div>

        <Card padding="lg">
          <TextInput
            id="admin-user-keyword"
            placeholder="Tìm theo tên, username hoặc email..."
            value={filters.keyword}
            onChange={(event) => handleFilterChange('keyword', event.target.value)}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              id="admin-user-role"
              label="Vai trò"
              value={filters.role}
              onChange={(event) => handleFilterChange('role', event.target.value)}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
            <Select
              id="admin-user-status"
              label="Trạng thái"
              value={filters.status}
              onChange={(event) => handleFilterChange('status', event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        </Card>

        {usersQuery.error ? <FormError message={usersQuery.error.message} /> : null}

        {usersQuery.isLoading ? (
          <Card className="px-6 py-12 text-center text-sm font-medium text-bone-500">
            Đang tải danh sách người dùng...
          </Card>
        ) : rows.length ? (
          <AdminUserTable
            rows={rows}
            pagination={pagination}
            page={filters.page}
            onPageChange={(page) => handleFilterChange('page', page)}
            onEdit={setEditingUser}
            onToggleBlock={setBlockTarget}
            onDelete={setDeleteTarget}
          />
        ) : (
          <Card className="px-6 py-12 text-center text-sm font-medium text-bone-500">
            Không tìm thấy người dùng nào.
          </Card>
        )}
      </div>

      <EditUserModal
        user={editingUser}
        onClose={() => { setEditingUser(null); setEditError(''); }}
        onSubmit={handleEditSubmit}
        isSubmitting={updateUserMutation.isPending}
        errorMessage={editError}
      />

      <ConfirmDialog
        isOpen={Boolean(blockTarget)}
        onClose={() => { setBlockTarget(null); setActionError(''); }}
        onConfirm={handleToggleBlockConfirm}
        isSubmitting={toggleStatusMutation.isPending}
        errorMessage={actionError}
        tone={blockTarget?.status === 'banned' ? 'primary' : 'danger'}
        title={blockTarget?.status === 'banned' ? 'Bỏ chặn tài khoản?' : 'Chặn tài khoản?'}
        description={
          blockTarget?.status === 'banned'
            ? `Tài khoản "${blockTarget?.name || blockTarget?.username}" sẽ được phép đăng nhập trở lại.`
            : `Tài khoản "${blockTarget?.name || blockTarget?.username}" sẽ không thể đăng nhập cho đến khi được bỏ chặn.`
        }
        confirmLabel={blockTarget?.status === 'banned' ? 'Bỏ chặn' : 'Chặn tài khoản'}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => { setDeleteTarget(null); setActionError(''); }}
        onConfirm={handleDeleteConfirm}
        isSubmitting={deleteUserMutation.isPending}
        errorMessage={actionError}
        tone="danger"
        title="Xoá tài khoản?"
        description={`Tài khoản "${deleteTarget?.name || deleteTarget?.username}" sẽ bị xoá vĩnh viễn khỏi hệ thống.`}
        note="Hành động này không thể hoàn tác."
        confirmLabel="Xoá tài khoản"
      />
    </AdminLayout>
  );
};
