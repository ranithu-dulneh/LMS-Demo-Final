import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPageWrapper from './pages/LandingPageWrapper';
import LoginPageWrapper from './pages/LoginPageWrapper';
import DashboardWrapper from './pages/student/DashboardWrapper';
import CourseView from './pages/student/CourseView';

import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminCourses from './pages/admin/Courses';
import CourseManage from './pages/admin/CourseManage';
import AdminSchedules from './pages/admin/Schedules';
import AdminMaterials from './pages/admin/Materials';
import AdminSettings from './pages/admin/Settings';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PastPapersWrapper from './pages/PastPapersWrapper';
import VideosWrapper from './pages/VideosWrapper';
import StoreWrapper from './pages/StoreWrapper';
import ResultsWrapper from './pages/ResultsWrapper';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPageWrapper />} />
            <Route path="login" element={<LoginPageWrapper />} />
            <Route path="past-papers" element={<PastPapersWrapper />} />
            <Route path="videos" element={<VideosWrapper />} />
            <Route path="store" element={<StoreWrapper />} />
            <Route path="results" element={<ResultsWrapper />} />

            <Route element={<ProtectedRoute />}>
              <Route path="student/dashboard" element={<DashboardWrapper />} />
              <Route path="student/course/:id" element={<CourseView />} />
            </Route>
        </Route>

        <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/:id" element={<CourseManage />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="materials" element={<AdminMaterials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
