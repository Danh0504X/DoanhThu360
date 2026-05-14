import { formatRelativeTime } from '../../utils/formatDate.js';

export const RecentActivityCard = ({ activities = [] }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-800">Hoạt động gần đây</h3>

    {activities.length ? (
      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            <p className="text-sm font-medium text-slate-700">{activity.title}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">{activity.description}</p>
              <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(activity.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
        Chưa có dữ liệu hoạt động gần đây
      </div>
    )}
  </section>
);
