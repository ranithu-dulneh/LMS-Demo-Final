import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const AdminSchedules: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar size={24} className="text-orange-600" /> Manage Schedules
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-6 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
            <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg min-w-[80px]">
              <span className="text-xs text-gray-500 font-bold uppercase">Sep</span>
              <span className="text-xl font-bold text-gray-900">{10 + i}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Live Q&A Session - Revision</h4>
              <p className="text-sm text-gray-500">8:00 PM - 10:00 PM • Zoom</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSchedules;
