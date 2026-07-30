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
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-bone-700">
        {label}
      </label>
    ) : null}
    <input
      ref={ref}
      className={[
        'h-12 w-full rounded-sm border bg-white px-4 text-bone-800 outline-none transition-brand placeholder:text-bone-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
        error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-bone-200',
        inputClassName,
      ].join(' ')}
      {...props}
    />
    {hint && !error ? <p className="mt-2 text-xs text-bone-500">{hint}</p> : null}
    {error ? <p className="mt-2 text-sm text-accent-red">{error}</p> : null}
  </div>
));

TextInput.displayName = 'TextInput';
