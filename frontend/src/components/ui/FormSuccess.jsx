export const FormSuccess = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`rounded-md border border-emerald-200 bg-accent-emerald-bg px-4 py-3 text-sm text-emerald-700 ${className}`}>
      {message}
    </div>
  );
};
