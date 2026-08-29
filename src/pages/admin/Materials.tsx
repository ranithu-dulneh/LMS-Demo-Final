import React from 'react';
import { FileText, Upload, Download } from 'lucide-react';

const AdminMaterials: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={24} className="text-teal-600" /> Manage Materials
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
          <Upload size={16} /> Upload New
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">Past Paper 202{i}</h4>
              <p className="text-xs text-gray-500">2.{i} MB • Assigned to Revision Class</p>
            </div>
            <button className="text-gray-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMaterials;
