import React from 'react';
import { Video, Plus } from 'lucide-react';

const AdminCourses: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Video size={24} className="text-purple-600" /> Manage Courses
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
          <Plus size={16} /> New Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <Video className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">A/L Accounting Unit {i}</h3>
            <p className="text-sm text-gray-500 mb-4">{10 + i} Lessons • Active</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
