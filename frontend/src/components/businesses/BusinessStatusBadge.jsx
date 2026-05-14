const statusConfig = {
  active: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-50 text-emerald-600',
  },
  inactive: {
    label: 'Ngừng hoạt động',
    className: 'bg-red-50 text-red-600',
  },
};

export const BusinessStatusBadge = ({ status = 'active' }) => {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};
