const toneClasses = {
  neutral: 'bg-bone-100 text-bone-600',
  emerald: 'bg-accent-emerald-bg text-accent-emerald',
  red: 'bg-accent-red-bg text-accent-red',
  amber: 'bg-accent-amber-bg text-accent-amber',
  primary: 'bg-primary-50 text-primary-700',
};

export const Badge = ({ tone = 'neutral', className = '', children }) => (
  <span className={['inline-flex rounded-sm px-3 py-1 text-xs font-bold', toneClasses[tone], className].join(' ')}>
    {children}
  </span>
);
