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

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-brand focus:outline-none focus:ring-2 focus:ring-primary-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border border-bone-200 bg-white text-bone-700 hover:bg-bone-50',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-50',
    soft: 'bg-primary-50 text-primary-800 hover:bg-primary-100',
    danger: 'border border-red-200 bg-accent-red-bg text-accent-red hover:bg-red-100',
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
