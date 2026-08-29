import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, LogIn, Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DM Education</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link to="/student/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Student Dashboard</Link>
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Admin Panel</Link>
            </div>

            <div className="flex items-center">
              <Link to="/login" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DM Education. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
