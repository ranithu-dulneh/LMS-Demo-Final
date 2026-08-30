import React, { useState, useEffect } from 'react';
import { X, Plus, Video, Settings, Lock, Unlock, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: number;
  title: string;
}

interface Session {
  id: number;
  lesson_id: number;
  title: string;
  youtube_link: string;
  is_free: boolean;
  price: number;
  created_at: string;
}

interface ManageSessionsModalProps {
  lesson: Lesson;
  onClose: () => void;
}

const ManageSessionsModal: React.FC<ManageSessionsModalProps> = ({ lesson, onClose }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_link: '',
    is_free: false,
    price: 0
  });

  useEffect(() => {
    fetchSessions();
  }, [lesson.id]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('id', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      alert(`Error fetching sessions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingSession(null);
    setFormData({ title: '', youtube_link: '', is_free: false, price: 0 });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      youtube_link: session.youtube_link,
      is_free: session.is_free,
      price: session.price
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSession) {
      const { data, error } = await supabase
        .from('sessions')
        .update(formData)
        .eq('id', editingSession.id)
        .select();

      if (!error && data) {
         setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, ...formData } : s));
         setIsFormOpen(false);
      } else {
         console.error("Error updating session", error);
         alert(`Failed to update session: ${error?.message}`);
      }
    } else {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ ...formData, lesson_id: lesson.id }])
        .select();

      if (!error && data) {
         setSessions([...sessions, data[0]]);
         setIsFormOpen(false);
      } else {
         console.error("Error inserting session", error);
         alert(`Failed to insert session: ${error?.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0 bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Manage Sessions</h3>
            <p className="text-gray-500 text-sm mt-1">Lesson: {lesson.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 relative">

          {/* List of Sessions */}
          <div className={`flex-1 transition-all ${isFormOpen ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800">Sessions ({sessions.length})</h4>
              {!isFormOpen && (
                <button
                  onClick={handleOpenNew}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus size={16} /> Add Session
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Video className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No sessions added yet.</p>
                {!isFormOpen && (
                  <button onClick={handleOpenNew} className="text-blue-600 text-sm font-medium mt-2 hover:underline">
                    Add the first session
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors bg-white shadow-sm flex items-start gap-3">
                    <div className="bg-gray-100 text-gray-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-gray-900 truncate" title={session.title}>{session.title}</h5>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        {session.is_free ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                            <Unlock size={10} /> Free
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                            <Lock size={10} /> Rs. {session.price}
                          </span>
                        )}
                        <a href={session.youtube_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 truncate">
                          <Video size={10} /> Link
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenEdit(session)}
                      className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form for Add/Edit Session */}
          {isFormOpen && (
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-5 lg:w-1/2 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-gray-900">{editingSession ? 'Edit Session' : 'Add New Session'}</h4>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 block lg:hidden">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Part 1: Introduction"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Recording Link</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.youtube_link}
                      onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg pl-9 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Open Access (Free)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.is_free}
                        onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                      />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {!formData.is_free && (
                    <div className="pt-2 border-t border-gray-100">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Session Fee (Rs.)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="number"
                          min={0}
                          placeholder="1500"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                          className="w-full border border-gray-300 rounded-lg pl-8 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          required={!formData.is_free}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    Save Session
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSessionsModal;
