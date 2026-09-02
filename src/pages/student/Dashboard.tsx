import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, CheckCircle, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  id: number;
  title: string;
  lessons: number;
  status: 'Active' | 'Draft';
  exam_year: string;
  thumbnail?: string;
  progress?: number;
  completedLessons?: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Get all active courses
      const { data: allCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'Active')
        .order('id', { ascending: false });

      if (coursesError) throw coursesError;

      // Get user's specific enrollments if they are logged in and not admin
      let myCourseIds: number[] = [];
      if (user && !user.is_admin) {
         const { data: enrollments, error: enrollError } = await supabase
           .from('enrollments')
           .select('course_id')
           .eq('user_id', user.id);

         if (!enrollError && enrollments) {
           myCourseIds = enrollments.map(e => e.course_id);
         }
      }

      // Filter courses: show if public OR if explicitly enrolled OR if admin
      const accessibleCourses = allCourses?.filter(c =>
         c.visibility === 'public' ||
         myCourseIds.includes(c.id) ||
         user?.is_admin
      ) || [];

      // Map DB data and add mock progress/thumbnails since they are not in DB yet
      const mappedData = accessibleCourses.map((c: any) => ({
        ...c,
        progress: Math.floor(Math.random() * 100),
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }));
      setCourses(mappedData);

    } catch (err: any) {
      console.error(err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = filterYear === 'All'
    ? courses
    : courses.filter(c => c.exam_year === filterYear);

  const uniqueYears = Array.from(new Set(courses.map(c => c.exam_year))).filter(Boolean).sort();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.user_metadata?.full_name || 'Student'}!</h1>
        <p className="text-gray-500 mt-2">You have completed 65% of your weekly goals. Keep it up!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-xl p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><PlayCircle size={24} /></div>
            <div>
              <p className="text-sm text-blue-900 font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-blue-700">{courses.length}</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-green-900 font-medium">Completed Lessons</p>
              <p className="text-2xl font-bold text-green-700">23</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-purple-900 font-medium">Study Hours</p>
              <p className="text-2xl font-bold text-purple-700">42h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>

          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm shadow-sm">
            <Filter size={16} className="text-gray-500" />
            <span className="text-gray-500 font-medium mr-1">Exam Year:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-transparent border-none outline-none text-blue-600 font-bold cursor-pointer"
            >
              <option value="All">All</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
           <div className="py-10 text-center text-gray-500">Loading your courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
               <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                 No courses available for the selected Exam Year.
               </div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {course.exam_year}
                    </div>
                    {course.progress === 100 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle size={14} /> Completed
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1"><BookOpen size={16} /> {course.lessons} Lessons</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-bold text-blue-600">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                      <Link
                        to={`/student/course/${course.id}`}
                        className={`w-full py-2.5 rounded-xl font-bold text-center block transition-colors ${
                          course.progress === 100
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
