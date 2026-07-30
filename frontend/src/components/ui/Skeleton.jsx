export const Skeleton = ({ className = '' }) => (
  <div className={['animate-pulse rounded-sm bg-bone-100', className].join(' ')} />
);
