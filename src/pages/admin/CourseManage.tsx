import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Settings, Video, ChevronLeft, X, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ManageSessionsModal from './ManageSessionsModal';

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  created_at: string;
}

const CourseManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [courseName, setCourseName] = useState<string>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonFormData, setLessonFormData] = useState({ title: '' });

  const [managingSessionsForLesson, setManagingSessionsForLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchCourseDetails();
    fetchLessons();
  }, [id]);

  const fetchCourseDetails = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.from('courses').select('title').eq('id', id).single();
      if (!error && data) {
        setCourseName(data.title);
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
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
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewLesson = () => {
    setEditingLesson(null);
    setLessonFormData({ title: '' });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title,
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (editingLesson) {
      const { data, error } = await supabase
        .from('lessons')
        .update(lessonFormData)
        .eq('id', editingLesson.id)
        .select();

      if (!error && data) {
         setLessons(lessons.map(l => l.id === editingLesson.id ? { ...l, ...lessonFormData } : l));
         setIsLessonModalOpen(false);
      } else {
         console.error("Error updating lesson", error);
         alert(`Failed to update lesson: ${error?.message}`);
      }
    } else {
      const { data, error } = await supabase
        .from('lessons')
        .insert([{ ...lessonFormData, course_id: parseInt(id) }])
        .select();

      if (!error && data) {
         setLessons([...lessons, data[0]]);
         setIsLessonModalOpen(false);
      } else {
         console.error("Error inserting lesson", error);
         alert(`Failed to insert lesson: ${error?.message}`);
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
            onClick={handleOpenNewLesson}
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
            <List className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No lessons added yet</p>
            <p className="text-sm mt-1 mb-6 max-w-sm">Start building this course by adding lessons, and then add sessions to those lessons.</p>
            <button onClick={handleOpenNewLesson} className="text-blue-600 font-bold hover:underline">Add First Lesson</button>
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
                    <p className="text-sm text-gray-500">Manage sessions and materials for this lesson.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setManagingSessionsForLesson(lesson)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Video size={16} /> Manage Sessions
                  </button>
                  <button
                    onClick={() => handleOpenEditLesson(lesson)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Settings size={16} /> Edit Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 5 - Electromagnetism"
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
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

      {/* Sessions Management Modal */}
      {managingSessionsForLesson && (
        <ManageSessionsModal
          lesson={managingSessionsForLesson}
          onClose={() => setManagingSessionsForLesson(null)}
        />
      )}
    </div>
  );
};

export default CourseManage;
