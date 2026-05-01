import { forwardRef } from 'react';

export const TextInput = forwardRef(({
  label,
  hint,
  error,
  className = '',
  inputClassName = '',
  ...props
}, ref) => (
  <div className={className}>
    {label ? (
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
    ) : null}
    <input
      ref={ref}
      className={[
        'h-12 w-full rounded-xl border bg-white px-4 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100',
        error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200',
        inputClassName,
      ].join(' ')}
      {...props}
    />
    {hint && !error ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
  </div>
));

TextInput.displayName = 'TextInput';
