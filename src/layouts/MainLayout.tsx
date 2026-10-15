import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { InspireLogo } from '../components/InspireLogo';
import { useAuth } from '../contexts/AuthContext';
import { ActiveTab, CurrentUser } from '../types';

import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { InstitutionSelectModal } from '../components/InstitutionSelectModal';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { AdminPanelModal } from '../components/AdminPanelModal';

import { pastPapersData, videoModulesData, studyMaterialsData } from '../data/mockData';

const MainLayout: React.FC = () => {
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation state mapped from React Router path
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/login') setActiveTab('login');
    else if (path.startsWith('/student/dashboard') || path.startsWith('/student/course')) setActiveTab('lms');
    else if (path === '/past-papers') setActiveTab('past-papers');
    else if (path === '/videos') setActiveTab('videos');
    else if (path === '/store') setActiveTab('store');
    else if (path === '/results') setActiveTab('results');
  }, [location]);

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') navigate('/');
    else if (tab === 'login') navigate('/login');
    else if (tab === 'lms') navigate('/student/dashboard');
    else if (tab === 'past-papers') navigate('/past-papers');
    else if (tab === 'videos') navigate('/videos');
    else if (tab === 'store') navigate('/store');
    else if (tab === 'results') navigate('/results');
  };

  // Convert authUser to match the expected UserProfile mock in the UI
  const currentUser: CurrentUser | null = authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.full_name || 'Student',
    indexNumber: authUser.user_metadata?.student_id || 'ID-TBD',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    role: 'Student',
    batch: '2024',
    overallProgress: 0,
    email: authUser.email || '',
    phone: ''
  } : null;

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [institutionSelectOpen, setInstitutionSelectOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Cart State (Mock)
  const [cartItems, setCartItems] = useState<any[]>([]);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col relative">

      {/* Ambient Background matching App.tsx */}
      <div
        className="fixed inset-0 z-0 pointer-events-none apple-bg-ambient overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-sky-200/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-1/3 w-[650px] h-[650px] bg-blue-200/20 rounded-full blur-[140px]" />
      </div>

      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        cartCount={totalCartCount}
        onOpenSignUp={() => setInstitutionSelectOpen(true)}
        onOpenLogin={() => handleNavigate('login')}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 md:pt-6 relative z-10">
        <Outlet context={{ openSignup: () => setInstitutionSelectOpen(true) }} />
      </main>

      <footer className="w-full border-t border-slate-200/70 bg-white/60 backdrop-blur-xl mt-12 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <InspireLogo size="md" />
            <div className="border-l border-slate-200 pl-3 text-left">
              <p className="font-bold text-slate-900">Inspire Institution</p>
              <p className="text-[11px] text-slate-400">Department of Examination Certified A/L Curriculum</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
            {currentUser ? (
              <>
                <button onClick={() => handleNavigate('home')} className="hover:text-blue-700 transition-colors">Home</button>
                <button onClick={() => handleNavigate('lms')} className="hover:text-blue-700 transition-colors">LMS Dashboard</button>
                <button onClick={() => handleNavigate('past-papers')} className="hover:text-blue-700 transition-colors">Past Papers</button>
                <button onClick={() => handleNavigate('videos')} className="hover:text-blue-700 transition-colors">Lectures</button>
                <button onClick={() => handleNavigate('store')} className="hover:text-blue-700 transition-colors">Study Store</button>
                <button onClick={() => handleNavigate('results')} className="hover:text-blue-700 transition-colors">Wall of Fame</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigate('home')} className="hover:text-blue-700 transition-colors">Home</button>
                <button onClick={() => handleNavigate('past-papers')} className="hover:text-blue-700 transition-colors">Past Papers</button>
                <button onClick={() => handleNavigate('videos')} className="hover:text-blue-700 transition-colors">Video Modules</button>
                <button onClick={() => handleNavigate('results')} className="hover:text-blue-700 transition-colors">Wall of Fame</button>
                <button onClick={() => handleNavigate('store')} className="hover:text-blue-700 transition-colors">Study Store</button>
                <button onClick={() => setInstitutionSelectOpen(true)} className="hover:text-blue-700 transition-colors">Institutes</button>
                <button onClick={() => handleNavigate('login')} className="hover:text-blue-700 transition-colors">Student Login</button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Inspire Institution. All rights reserved.</span>
            {authUser?.is_admin && (
                <button
                onClick={() => navigate('/admin')}
                className="text-slate-500 hover:text-slate-800 font-semibold underline transition-colors"
                >
                Admin Portal
                </button>
            )}
          </div>
        </div>
      </footer>

      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        isLoggedIn={Boolean(currentUser)}
        onOpenLogin={() => handleNavigate('login')}
      />

      <InstitutionSelectModal
        isOpen={institutionSelectOpen}
        onClose={() => setInstitutionSelectOpen(false)}
        onSelectInstitute={(inst) => {
          setSelectedInstitution(inst);
          setInstitutionSelectOpen(false);
          setEnrollmentModalOpen(true);
        }}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        pastPapers={pastPapersData}
        videos={videoModulesData}
        materials={studyMaterialsData}
        onSelectPaper={(p) => {
          // Add handling to navigate / show paper
        }}
        onSelectVideo={(v) => {
          // Add handling
        }}
        onSelectMaterial={(m) => {
          // handleAddToCart(m);
        }}
      />

      <EnrollmentModal
        isOpen={enrollmentModalOpen}
        onClose={() => setEnrollmentModalOpen(false)}
        selectedInstitute={selectedInstitution}
        onChangeInstitute={() => {
          setEnrollmentModalOpen(false);
          setInstitutionSelectOpen(true);
        }}
      />
    </div>
  );
};

export default MainLayout;
