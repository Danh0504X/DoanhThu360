import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Switch } from '../../components/ui/Switch.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAppSettings, useUpdateAppSettings } from '../../hooks/useAdmin.js';

export const AdminSettingsPage = () => {
  const toast = useToast();
  const settingsQuery = useAppSettings();
  const updateSettingsMutation = useUpdateAppSettings();
  const [pendingField, setPendingField] = useState(null);

  const registrationEnabled = settingsQuery.data?.registrationEnabled ?? true;

  const handleToggleRegistration = async (checked) => {
    try {
      setPendingField('registrationEnabled');
      await updateSettingsMutation.mutateAsync({ registrationEnabled: checked });
      toast.success(checked ? 'Đã mở đăng ký tài khoản mới' : 'Đã tạm khoá đăng ký tài khoản mới');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật cấu hình');
    } finally {
      setPendingField(null);
    }
  };

  return (
    <AdminLayout activeNav="settings">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-bone-950">Cấu hình</h1>
          <p className="mt-1 text-sm text-bone-500">Điều chỉnh các thiết lập chung của hệ thống.</p>
        </div>

        <Card padding="lg">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-sm font-bold text-bone-800">Cho phép đăng ký tài khoản mới</h2>
              <p className="mt-1 text-sm leading-6 text-bone-500">
                Khi tắt, trang đăng ký sẽ hiển thị thông báo tạm khoá và không cho tạo tài khoản mới.
              </p>
            </div>
            <Switch
              checked={registrationEnabled}
              onChange={handleToggleRegistration}
              disabled={settingsQuery.isLoading || (updateSettingsMutation.isPending && pendingField === 'registrationEnabled')}
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
