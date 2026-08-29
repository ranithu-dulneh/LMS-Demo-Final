import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, CheckCircle } from 'lucide-react';

const mockCourses = [
  { id: 'c1', title: 'A/L Accounting - Revision 2024', progress: 65, totalLessons: 24, completedLessons: 15, thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'c2', title: 'Theory Class - Unit 05', progress: 30, totalLessons: 10, completedLessons: 3, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'c3', title: 'Past Paper Discussion 2023', progress: 100, totalLessons: 5, completedLessons: 5, thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
];

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Student!</h1>
        <p className="text-gray-500 mt-2">You have completed 65% of your weekly goals. Keep it up!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-xl p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><PlayCircle size={24} /></div>
            <div>
              <p className="text-sm text-blue-900 font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-blue-700">3</p>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <button className="text-blue-600 font-medium hover:text-blue-800">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={14} /> Completed
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><BookOpen size={16} /> {course.totalLessons} Lessons</span>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                    <div
                      className={`h-2.5 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${course.progress}%` }}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
