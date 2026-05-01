export const queryKeys = {
  currentUser: ['currentUser'],
  revenues: (params = {}) => ['revenues', params],
  revenue: (id) => ['revenue', id],
  revenueSummary: (params = {}) => ['revenueSummary', params],
  dashboard: (params = {}) => ['dashboard', params],
  dashboardChart: (params = {}) => ['dashboard', 'chart', params],
  dashboardRecentRevenues: (params = {}) => ['dashboard', 'recent-revenues', params],
  reports: (params = {}) => ['reports', params],
  taxReports: (params = {}) => ['taxReports', params],
};
