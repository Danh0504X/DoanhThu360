import { Card } from '../ui/Card.jsx';

export const AuthCard = ({ children, className = '' }) => (
  <Card padding="none" className={`rounded-lg p-5 sm:p-7 ${className}`}>
    {children}
  </Card>
);
