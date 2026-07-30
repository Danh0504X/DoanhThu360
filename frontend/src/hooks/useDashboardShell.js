import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/useToast.js';

export const UNSUPPORTED_ACTION_MESSAGE = 'Chức năng này chưa được backend hỗ trợ.';

// Shared nav-dispatch + "not implemented yet" fallback used by the dashboard
// shell (Sidebar/DashboardLayout) and any page that needs the same behavior
// for its own mobile view (e.g. MobileDashboard, AnalyticsPage's mobile toggle).
export const useDashboardShell = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleUnsupportedAction = () => {
    toast.info(UNSUPPORTED_ACTION_MESSAGE);
  };

  const handleNavigate = (item) => {
    if (item?.id === 'dashboard') {
      navigate('/dashboard');
      return;
    }

    if (item?.id === 'cash-flow') {
      navigate('/revenues');
      return;
    }

    if (item?.to) {
      navigate(item.to);
      return;
    }

    handleUnsupportedAction();
  };

  const handleProfileClick = () => navigate('/account');

  return {
    navigate,
    handleNavigate,
    handleUnsupportedAction,
    handleProfileClick,
    unsupportedMessage: UNSUPPORTED_ACTION_MESSAGE,
  };
};
