export const Button = ({
  as,
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const Component = as || 'button';

  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60';
  const variantClasses = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'bg-transparent text-teal-700 hover:bg-teal-50',
    soft: 'bg-teal-50 text-teal-800 hover:bg-teal-100',
    danger: 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
  };
  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-5 text-sm',
    lg: 'h-14 px-6 text-base',
  };

  const mergedClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={mergedClassName}
      disabled={Component === 'button' ? disabled || isLoading : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </Component>
  );
};
