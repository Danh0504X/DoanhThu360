const AppMark = () => (
  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-sm shadow-teal-100">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
      <path d="M4 9.5 12 5l8 4.5" />
      <path d="M6 10.5V19h12v-8.5" />
      <path d="M9 12h6" />
      <path d="M9 15h6" />
    </svg>
  </div>
);

export const AuthLayout = ({ title, subtitle, illustration, children, footer }) => {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col justify-center gap-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden rounded-[32px] border border-white/70 bg-linear-to-br from-teal-100 via-white to-slate-100 p-8 shadow-sm lg:block">
            <div className="max-w-md">
              <div className="mb-6">
                <AppMark />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-teal-800">
                Doanh Thu 360
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Quản lý doanh thu, theo dõi dòng tiền và hỗ trợ khai báo thuế với trải nghiệm rõ ràng, dễ thao tác mỗi ngày.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/80 p-5">
                  <p className="text-sm text-slate-500">Phù hợp</p>
                  <p className="mt-2 text-base font-medium text-slate-800">Hộ kinh doanh và doanh nghiệp nhỏ</p>
                </div>
                <div className="rounded-3xl bg-white/80 p-5">
                  <p className="text-sm text-slate-500">Trải nghiệm</p>
                  <p className="mt-2 text-base font-medium text-slate-800">Dễ đọc, dễ bấm, dễ kiểm tra số liệu</p>
                </div>
              </div>
              {illustration ? (
                <div className="mt-8 overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-3">
                  <img src={illustration} alt="" className="h-64 w-full rounded-[22px] object-cover" />
                </div>
              ) : null}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="mb-7 flex flex-col items-center text-center lg:hidden">
              <AppMark />
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-teal-800">Doanh Thu 360</h1>
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>

            {children}

            {footer ? <div className="mt-6">{footer}</div> : null}
          </section>
        </div>

        <footer className="hidden flex-col gap-3 px-1 text-xs text-slate-500 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Doanh Thu 360. Giải pháp quản lý thuế ổn định và minh bạch.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-teal-700">Điều khoản sử dụng</a>
            <a href="/" className="hover:text-teal-700">Chính sách bảo mật</a>
            <a href="/" className="hover:text-teal-700">Hỗ trợ</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
