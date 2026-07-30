import { Badge } from '../ui/Badge.jsx';

const statusConfig = {
  active: { label: 'Đang hoạt động', tone: 'emerald' },
  inactive: { label: 'Ngừng hoạt động', tone: 'red' },
};

export const BusinessStatusBadge = ({ status = 'active' }) => {
  const config = statusConfig[status] || statusConfig.active;

  return <Badge tone={config.tone}>{config.label}</Badge>;
};
