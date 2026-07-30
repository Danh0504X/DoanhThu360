import { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  hint,
  error,
  className = '',
  selectClassName = '',
  children,
  ...props
}, ref) => (
  <div className={className}>
    {label ? (
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-bone-700">
        {label}
      </label>
    ) : null}
    <select
      ref={ref}
      className={[
        'h-12 w-full rounded-sm border bg-white px-4 text-bone-800 outline-none transition-brand focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
        error ? 'border-accent-red focus:border-accent-red focus:ring-red-100' : 'border-bone-200',
        selectClassName,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
    {hint && !error ? <p className="mt-2 text-xs text-bone-500">{hint}</p> : null}
    {error ? <p className="mt-2 text-sm text-accent-red">{error}</p> : null}
  </div>
));

Select.displayName = 'Select';
