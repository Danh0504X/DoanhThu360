export const SecuritySupportCard = () => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3 5 6v6c0 4.2 2.7 8 7 9 4.3-1 7-4.8 7-9V6l-7-3Z" />
          <path d="M9.5 12.5 11 14l3.5-4" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-slate-800">Cần hỗ trợ bảo mật?</p>
        <p className="mt-1 text-sm text-slate-500">Liên hệ đội ngũ kỹ thuật của Doanh Thu 360.</p>
      </div>
    </div>

    <button type="button" className="mt-5 text-sm font-semibold text-teal-700 transition hover:text-teal-800">
      Trò chuyện ngay →
    </button>
  </section>
);
