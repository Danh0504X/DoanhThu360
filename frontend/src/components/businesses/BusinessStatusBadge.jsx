const statusConfig = {
  active: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  inactive: {
    label: 'Ngừng hoạt động',
    className: 'bg-red-50 text-red-700 border-red-100',
  },
};

export const BusinessStatusBadge = ({ status = 'active' }) => {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  );
};
