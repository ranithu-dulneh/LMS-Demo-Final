import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, MessageSquare, Download, Video, Lock, Play } from 'lucide-react';
import CustomVideoPlayer from '../../components/video/CustomVideoPlayer';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  youtube_link: string;
  is_free: boolean;
  price: number;
  created_at: string;
}

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'discussion'>('materials');

  useEffect(() => {
    fetchCourseAndLessons();
  }, [id]);

  const fetchCourseAndLessons = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', id).single(),
        supabase.from('lessons').select('*').eq('course_id', id).order('id', { ascending: true })
      ]);

      if (courseRes.error) throw courseRes.error;
      if (lessonsRes.error) throw lessonsRes.error;

      setCourse(courseRes.data);
      setLessons(lessonsRes.data || []);
      if (lessonsRes.data && lessonsRes.data.length > 0) {
        setActiveLesson(lessonsRes.data[0]);
      }
    } catch (err: any) {
      console.error("Error fetching course data:", err);
      alert(`Error loading course: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Mock materials/discussions for now until we have tables for them
  const mockMaterials = [
    { id: 1, title: 'Lecture Slides', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Tutorial Questions', type: 'PDF', size: '1.2 MB' }
  ];

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading course details...</div>;
  }

  if (!course) {
    return <div className="py-10 text-center text-red-500">Course not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content (Video & Details) */}
      <div className="flex-1 space-y-6">
        <div>
          <Link to="/student/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{activeLesson ? activeLesson.title : course.title}</h1>
          <p className="text-gray-500 mt-1">{course.title}</p>
        </div>

        {/* Video Player Section */}
        {activeLesson ? (
          <div className="shadow-xl rounded-2xl bg-black overflow-hidden">
            <CustomVideoPlayer key={activeLesson.id} url={activeLesson.youtube_link} />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl aspect-video flex flex-col items-center justify-center text-gray-500">
            <Video size={48} className="mb-4 opacity-50" />
            <p>No lessons available for this course yet.</p>
          </div>
        )}

        {/* Course Info & Tabs */}
        {activeLesson && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 py-4 px-2 mr-8 border-b-2 font-medium transition-colors ${activeTab === 'materials' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <FileText size={18} /> Lesson Materials
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'discussion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare size={18} /> Q&A Discussion
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-gray-50/50 min-h-[300px]">
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  {mockMaterials.map(material => (
                    <div key={material.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-lg text-red-500">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{material.title}</h4>
                          <p className="text-xs text-gray-500">{material.type} • {material.size}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                        <Download size={18} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="text-center text-gray-500 py-10">
                  Discussion feature is coming soon.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (Playlist) */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900">Course Lessons</h3>
            <p className="text-sm text-gray-500">{lessons.length} lessons</p>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {lessons.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No lessons found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left p-4 flex gap-3 transition-colors ${
                      activeLesson?.id === lesson.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {activeLesson?.id === lesson.id ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Play size={12} className="ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm ${activeLesson?.id === lesson.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {!lesson.is_free && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                            <Lock size={10} /> Paid
                          </span>
                        )}
                        {lesson.is_free && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
