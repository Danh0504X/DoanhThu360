export const AuthCard = ({ children, className = '' }) => (
  <div className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${className}`}>
    {children}
  </div>
);
