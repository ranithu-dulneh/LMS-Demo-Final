import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Video, Settings, X, Lock, Unlock, DollarSign, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  youtube_link: string;
  is_free: boolean;
  price: number;
}

const CourseManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [courseName, setCourseName] = useState('Loading Course...');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    youtube_link: '',
    is_free: false,
    price: 0
  });

  useEffect(() => {
    fetchCourseDetails();
    fetchLessons();
  }, [id]);

  const fetchCourseDetails = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.from('courses').select('title').eq('id', id).single();
      if (data && !error) {
        setCourseName(data.title);
      } else {
        setCourseName(`Course ID: ${id}`);
      }
    } catch (err) {
      setCourseName(`Course ID: ${id}`);
    }
  };

  const fetchLessons = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('id', { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error);
        alert(`Error fetching lessons: ${error.message}`);
      } else {
        setLessons(data || []);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingLesson(null);
    setFormData({ title: '', youtube_link: '', is_free: false, price: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      youtube_link: lesson.youtube_link,
      is_free: lesson.is_free,
      price: lesson.price
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (editingLesson) {
      // Edit existing
      const { error } = await supabase
        .from('lessons')
        .update(formData)
        .eq('id', editingLesson.id)
        .select();

      if (!error) {
         setLessons(lessons.map(l => l.id === editingLesson.id ? { ...l, ...formData } : l));
         setIsModalOpen(false);
      } else {
         console.error("Error updating lesson", error);
         alert(`Failed to update lesson: ${error.message}`);
      }
    } else {
      // Add new
      const payload = { ...formData, course_id: Number(id) };
      const { data, error } = await supabase
        .from('lessons')
        .insert([payload])
        .select();

      if (!error && data) {
         setLessons([...lessons, data[0]]);
         setIsModalOpen(false);
      } else {
         console.error("Error inserting lesson", error);
         alert(`Failed to insert lesson: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/admin/courses" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Courses
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Lessons</h1>
            <p className="text-gray-500 mt-1">{courseName}</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add Lesson
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading lessons...</div>
        ) : lessons.length === 0 ? (
          <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <Video className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No lessons added yet</p>
            <p className="text-sm mt-1 mb-6 max-w-sm">Start building this course by adding YouTube recordings and study materials.</p>
            <button onClick={handleOpenNew} className="text-blue-600 font-bold hover:underline">Add First Lesson</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-blue-50 text-blue-600 font-bold w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{lesson.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <a href={lesson.youtube_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Video size={14} /> View Recording
                      </a>
                      <span className="text-gray-300">|</span>
                      {lesson.is_free ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded text-xs">
                          <Unlock size={12} /> Open Access
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded text-xs">
                          <Lock size={12} /> Paid Access (Rs. {lesson.price})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Upload size={16} /> Upload Docs
                  </button>
                  <button
                    onClick={() => handleOpenEdit(lesson)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Settings size={16} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 5 - Introduction"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Recording Link</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.youtube_link}
                    onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Access & Payment Controls */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2">Access & Pricing Control</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Open Access (Free)</p>
                    <p className="text-xs text-gray-500">Allow any registered user to view this lesson</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {!formData.is_free && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Fee for this Lesson (Rs.)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        min={0}
                        placeholder="1500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        required={!formData.is_free}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Students who have already paid the general class fee will automatically have access.
                      External users will be prompted to pay this amount to unlock the content.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                >
                  {editingLesson ? 'Update Lesson' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManage;
