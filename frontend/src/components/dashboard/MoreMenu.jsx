import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Icon } from './DashboardIcons.jsx';

const MENU_ITEMS = [
  { id: 'profile', label: 'Thông tin cá nhân', icon: 'user', to: '/account' },
  { id: 'business', label: 'Thông tin doanh nghiệp', icon: 'briefcase', to: '/businesses' },
  { id: 'logout', label: 'Đăng xuất', icon: 'logout', danger: true },
];

const MoreMenuItems = ({ onItemClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleItemClick = async (item) => {
    onItemClick();
    if (item.id === 'logout') {
      if (logout) {
        await logout();
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      navigate('/login', { replace: true });
      return;
    }
    if (item.to) {
      navigate(item.to);
    }
  };

  return (
    <div className="flex flex-col">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleItemClick(item)}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
            item.danger
              ? 'text-red-600 hover:bg-red-50'
              : 'text-bone-700 hover:bg-bone-50'
          }`}
        >
          <Icon name={item.icon} className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export const MobileMoreMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      <div 
        className="fixed inset-0 z-40 bg-black/30 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-bone-100 bg-white pb-6 pt-2 shadow-2xl transition-transform duration-200">
        <div className="mb-4 flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-bone-200" />
        </div>
        <div className="px-2">
          <MoreMenuItems onItemClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export const DesktopMoreMenu = ({ isOpen, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Allow clicking the trigger button without immediately closing
      if (ref.current && !ref.current.contains(event.target)) {
        // We use a small timeout to let the click event on the toggle button fire first
        // If the toggle button was clicked, it will handle toggling on its own.
        // Actually, stopping propagation on the button click is better, but this works too.
        setTimeout(() => onClose(), 0);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className="absolute bottom-0 left-full z-50 ml-2 min-w-[220px] rounded-lg border border-bone-200 bg-white py-2 shadow-sm"
      // Added onClick to stop propagation so clicking inside doesn't trigger the button click again if it bubbled
      onClick={(e) => e.stopPropagation()}
    >
      <MoreMenuItems onItemClick={onClose} />
    </div>
  );
};
