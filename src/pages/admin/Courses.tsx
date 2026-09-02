import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Plus, X, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: number;
  title: string;
  lessons: number;
  status: 'Active' | 'Draft';
  exam_year: string;
  visibility: 'assignable' | 'public';
}

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filterYear, setFilterYear] = useState<string>('All');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    lessons: 0,
    status: 'Active' as 'Active' | 'Draft',
    exam_year: new Date().getFullYear().toString(),
    visibility: 'assignable' as 'assignable' | 'public'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        alert(`Error fetching courses: ${error.message}`);
      } else {
        setCourses(data || []);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingCourse(null);
    setFormData({ title: '', lessons: 0, status: 'Active', exam_year: new Date().getFullYear().toString(), visibility: 'assignable' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      lessons: course.lessons,
      status: course.status,
      exam_year: course.exam_year || '',
      visibility: course.visibility || 'assignable'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      // Edit existing
      const { error } = await supabase
        .from('courses')
        .update(formData)
        .eq('id', editingCourse.id)
        .select();

      if (!error) {
         setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
         setIsModalOpen(false);
      } else {
         console.error("Error updating", error);
         alert(`Failed to update course: ${error.message}`);
      }
    } else {
      // Add new
      const { data, error } = await supabase
        .from('courses')
        .insert([formData])
        .select();

      if (!error && data) {
         setCourses([data[0], ...courses]);
         setIsModalOpen(false);
      } else {
         console.error("Error inserting", error);
         alert(`Failed to insert course: ${error.message}`);
      }
    }
  };

  const filteredCourses = filterYear === 'All'
    ? courses
    : courses.filter(c => c.exam_year === filterYear);

  // Get unique years for the filter dropdown
  const uniqueYears = Array.from(new Set(courses.map(c => c.exam_year))).filter(Boolean).sort();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Video size={24} className="text-purple-600" /> Manage Courses
        </h2>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-700 font-medium"
            >
              <option value="All">All Exam Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500">No courses found for the selected filter.</div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-purple-100 z-10">
                  {course.exam_year || 'Any'}
                </div>
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="text-gray-300" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.lessons} Lessons • {course.status}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <Link
                    to={`/admin/courses/${course.id}`}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden m-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Year / Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={formData.exam_year}
                    onChange={(e) => setFormData({ ...formData, exam_year: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Lessons</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.lessons}
                    onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'assignable' | 'public' })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="assignable">Assignable (Invite Only)</option>
                    <option value="public">Public (Purchase List)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
