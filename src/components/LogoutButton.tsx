import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { authService } from '@/services/authService';

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'button' | 'link';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  showIcon = true,
  variant = 'button'
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth state
    dispatch(logout());
    
    // Clear local storage
    authService.logout();
    
    // Redirect to login
    navigate('/login');
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors ${className}`}
      >
        {showIcon && <LogOut className="h-5 w-5" />}
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ${className}`}
    >
      {showIcon && <LogOut className="h-5 w-5" />}
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
