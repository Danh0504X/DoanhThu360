import { forwardRef, useState } from 'react';

const EyeIcon = ({ open }) => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.3 10.3 0 0 1 12 5c6.5 0 10 7 10 7a16.6 16.6 0 0 1-4.1 4.8" />
        <path d="M6.2 6.3C3.7 8 2 12 2 12s3.5 7 10 7c1.7 0 3.1-.4 4.4-1" />
      </>
    )}
  </svg>
);

export const PasswordInput = forwardRef(({
  label,
  hint,
  error,
  className = '',
  ...props
}, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={props.id} className="mb-2 block text-xs font-bold uppercase text-bone-600">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={[
            'h-12 w-full rounded-sm border bg-bone-100 px-4 pr-12 text-sm font-semibold text-bone-800 outline-none transition-brand placeholder:text-bone-500 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-100',
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-bone-100',
          ].join(' ')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-bone-500 hover:text-bone-700"
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {hint && !error ? <p className="mt-2 text-xs font-medium text-bone-500">{hint}</p> : null}
      {error ? <p className="mt-2 text-sm font-semibold text-accent-red">{error}</p> : null}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
