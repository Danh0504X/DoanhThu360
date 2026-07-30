export const FormError = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`rounded-md border border-red-200 bg-accent-red-bg px-4 py-3 text-sm text-red-700 ${className}`}>
      {message}
    </div>
  );
};
