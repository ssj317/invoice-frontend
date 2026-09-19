import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#178C92]">
              Invoice Pro
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-[#178C92] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/invoices"
                  className="text-gray-700 hover:text-[#178C92] transition-colors"
                >
                  Invoices
                </Link>
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  {/* Logout Button */}
                  <LogoutButton variant="button" />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#178C92] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#178C92] text-white px-4 py-2 rounded-lg hover:bg-[#0f6368] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

