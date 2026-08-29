import React from 'react';
import { Users, Video, FileText, CheckCircle, Upload } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Video size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Materials</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Upload Form (Mock) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Upload size={20} className="text-blue-600"/> Quick Material Upload
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Unit 5 Past Papers" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Assignment</label>
              <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>A/L Accounting - Revision 2024</option>
                <option>Theory Class - Unit 05</option>
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag & drop PDF here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Uploads securely via Google Drive API</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
              Upload Document
            </button>
          </form>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
           <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">New student registered</p>
                    <p className="text-xs text-gray-500">Kamal Perera joined Revision 2024</p>
                    <p className="text-xs text-gray-400 mt-1">{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
