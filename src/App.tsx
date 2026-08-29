import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminCourses from './pages/admin/Courses';
import CourseManage from './pages/admin/CourseManage';
import AdminSchedules from './pages/admin/Schedules';
import AdminMaterials from './pages/admin/Materials';
import AdminSettings from './pages/admin/Settings';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/course/:id" element={<CourseView />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:id" element={<CourseManage />} />
          <Route path="schedules" element={<AdminSchedules />} />
            <Route path="materials" element={<AdminMaterials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
