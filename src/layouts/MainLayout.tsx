import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Menu, User, LogOut, ChevronDown, Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const MainLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('status', 'Active')
        .order('id', { ascending: false })
        .limit(5); // Show top 5 recent courses

      if (!error && data) {
        setCourses(data);
      }
    } catch (err) {
      console.error("Error fetching courses for menu", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
    navigate('/');
  };

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
              {user && <Link to="/student/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Student Dashboard</Link>}
              {user?.role === 'admin' && <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Admin Panel</Link>}
            </div>

            <div className="flex items-center">
              {!user ? (
                <Link to="/login" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              ) : (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium transition-colors border border-gray-200"
                  >
                    <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden md:block max-w-[100px] truncate text-sm">
                      {user.user_metadata?.full_name || 'Profile'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user.user_metadata?.full_name || 'Student'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-2 px-3">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Your Courses</p>
                        {courses.length > 0 ? (
                          courses.map(c => (
                            <Link
                              key={c.id}
                              to={`/student/course/${c.id}`}
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                            >
                              <Book className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{c.title}</span>
                            </Link>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-gray-500 italic">No active courses.</div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-2 px-3">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button className="md:hidden ml-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
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
