import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDocumentAccess } from '@/hooks/useDocumentAccess';
import { useAuth } from '@/hooks/useAuth';

const DocumentProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const hasAccess = useDocumentAccess();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 text-sm">
            This feature is only available to Elite8 Digital team members.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DocumentProtectedRoute;
