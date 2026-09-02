import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    // Need a way to display a toast, or we just redirect to login with a state parameter
    // For now, redirecting and using a query param to show the error on login page
    return <Navigate to="/login?error=unauthorized" replace />;
  }

  // Check if admin is required
  if (requireAdmin) {
     if (!user.is_admin) {
         return <Navigate to="/" replace />;
     }
  } else {
     // Student route access check
     if (!user.is_admin && user.student_profile?.is_approved !== true) {
       return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
               <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                 <ShieldAlert size={32} />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
               <p className="text-gray-500 mb-8">
                 Your account has been created successfully but is waiting for an administrator to approve it.
                 You will be able to access your courses once approved.
               </p>
               <button
                 onClick={() => window.location.href = '/'}
                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full"
               >
                 Return to Home
               </button>
            </div>
         </div>
       );
     }
  }

  return <Outlet />;
};

export default ProtectedRoute;
