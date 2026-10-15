import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminSettings: React.FC = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [mediums, setMediums] = useState<any[]>([]);
  const [newInstName, setNewInstName] = useState('');
  const [newInstLocation, setNewInstLocation] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [newMediumName, setNewMediumName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const [instRes, batchRes, medRes] = await Promise.all([
        supabase.from('institutions').select('*').order('created_at', { ascending: true }),
        supabase.from('intake_batches').select('*').order('created_at', { ascending: true }),
        supabase.from('mediums').select('*').order('created_at', { ascending: true })
      ]);
      if (instRes.data) setInstitutions(instRes.data);
      if (batchRes.data) setBatches(batchRes.data);
      if (medRes.data) setMediums(medRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addInstitution = async () => {
    if (!newInstName) return;
    const { data, error } = await supabase.from('institutions').insert([{ name: newInstName, location: newInstLocation }]).select();
    if (!error && data) {
      setInstitutions([...institutions, data[0]]);
      setNewInstName('');
      setNewInstLocation('');
    }
  };

  const deleteInstitution = async (id: string) => {
    await supabase.from('institutions').delete().eq('id', id);
    setInstitutions(institutions.filter(i => i.id !== id));
  };

  const addBatch = async () => {
    if (!newBatchName) return;
    const { data, error } = await supabase.from('intake_batches').insert([{ name: newBatchName }]).select();
    if (!error && data) {
      setBatches([...batches, data[0]]);
      setNewBatchName('');
    }
  };

  const deleteBatch = async (id: string) => {
    await supabase.from('intake_batches').delete().eq('id', id);
    setBatches(batches.filter(b => b.id !== id));
  };

  const addMedium = async () => {
    if (!newMediumName) return;
    const { data, error } = await supabase.from('mediums').insert([{ name: newMediumName }]).select();
    if (!error && data) {
      setMediums([...mediums, data[0]]);
      setNewMediumName('');
    }
  };

  const deleteMedium = async (id: string) => {
    await supabase.from('mediums').delete().eq('id', id);
    setMediums(mediums.filter(m => m.id !== id));
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-gray-600" /> Platform Settings
        </h2>
      </div>
      <div className="space-y-10 max-w-4xl">
        <div className="border-b border-gray-100 pb-6">
          <h3 className="font-bold text-gray-900 mb-4">General Information</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="DM Education" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" defaultValue="admin@dmeducation.com" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Save Changes</button>
          </div>
        </div>

        {/* Institutions */}
        <div className="border-b border-gray-100 pb-6">
          <h3 className="font-bold text-gray-900 mb-4">Institutions (Centers)</h3>
          <div className="space-y-3 mb-4">
            {institutions.map(inst => (
              <div key={inst.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">{inst.name}</div>
                  <div className="text-xs text-gray-500">{inst.location || 'No location'}</div>
                </div>
                <button onClick={() => deleteInstitution(inst.id)} className="text-red-500 hover:text-red-700 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Institution Name"
              value={newInstName}
              onChange={e => setNewInstName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2.5 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Location (Optional)"
              value={newInstLocation}
              onChange={e => setNewInstLocation(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2.5 outline-none text-sm"
            />
            <button onClick={addInstitution} className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-1">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Intake Batches */}
        <div className="border-b border-gray-100 pb-6">
          <h3 className="font-bold text-gray-900 mb-4">Intake Batches</h3>
          <div className="space-y-2 mb-4">
            {batches.map(batch => (
              <div key={batch.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">{batch.name}</span>
                <button onClick={() => deleteBatch(batch.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. A/L 2026 Intake"
              value={newBatchName}
              onChange={e => setNewBatchName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2.5 outline-none text-sm max-w-sm"
            />
            <button onClick={addBatch} className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-1">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Mediums */}
        <div className="border-b border-gray-100 pb-6">
          <h3 className="font-bold text-gray-900 mb-4">Language Mediums</h3>
          <div className="space-y-2 mb-4">
            {mediums.map(medium => (
              <div key={medium.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">{medium.name}</span>
                <button onClick={() => deleteMedium(medium.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Sinhala"
              value={newMediumName}
              onChange={e => setNewMediumName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2.5 outline-none text-sm max-w-sm"
            />
            <button onClick={addMedium} className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-1">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
