import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-gray-600" /> Platform Settings
        </h2>
      </div>
      <div className="space-y-6 max-w-2xl">
        <div className="border-b border-gray-100 pb-6">
          <h3 className="font-bold text-gray-900 mb-4">General Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="DM Education" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" defaultValue="admin@dmeducation.com" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" />
            </div>
          </div>
        </div>
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
