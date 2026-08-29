import React, { useState } from 'react';
import { Video, Plus, X } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  lessons: number;
  status: 'Active' | 'Draft';
}

const initialCourses: Course[] = [
  { id: 1, title: 'A/L Accounting Unit 1', lessons: 11, status: 'Active' },
  { id: 2, title: 'A/L Accounting Unit 2', lessons: 12, status: 'Active' },
  { id: 3, title: 'A/L Accounting Unit 3', lessons: 13, status: 'Active' },
];

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', lessons: 0, status: 'Active' as 'Active' | 'Draft' });

  const handleOpenNew = () => {
    setEditingCourse(null);
    setFormData({ title: '', lessons: 0, status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({ title: course.title, lessons: course.lessons, status: course.status });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      // Edit existing
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      // Add new
      const newCourse: Course = {
        id: Date.now(),
        ...formData
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Video size={24} className="text-purple-600" /> Manage Courses
        </h2>
        <button
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <Plus size={16} /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <Video className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{course.lessons} Lessons • {course.status}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenEdit(course)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
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
