import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/course/:id" element={<CourseView />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Add other admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
