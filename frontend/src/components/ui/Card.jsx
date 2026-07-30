export const Card = ({
  as,
  padding = 'md',
  inset = false,
  className = '',
  children,
  ...props
}) => {
  const Component = as || 'div';
  const paddingClasses = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-7' };
  const base = inset
    ? 'rounded-sm border border-bone-100 bg-bone-50'
    : 'rounded-md border border-bone-200 bg-white';

  return (
    <Component className={[base, paddingClasses[padding], className].join(' ')} {...props}>
      {children}
    </Component>
  );
};
