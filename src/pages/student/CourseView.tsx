import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, MessageSquare, Video, Lock, Play, ChevronDown, ChevronUp, Download, Eye, X } from 'lucide-react';
import CustomVideoPlayer from '../../components/video/CustomVideoPlayer';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  created_at: string;
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

interface Material {
  id: number;
  title: string;
  file_url: string;
  file_size: number;
  course_id: number | null;
  lesson_id: number | null;
  session_id: number | null;
  created_at: string;
}

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sessions, setSessions] = useState<Record<number, Session[]>>({}); // lesson_id -> Session[]
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);

  const [loading, setLoading] = useState(true);

  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'discussion'>('materials');
  const [activeMaterialUrl, setActiveMaterialUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseAndData();
  }, [id]);

  const fetchCourseAndData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: courseData, error: courseError } = await supabase.from('courses').select('*').eq('id', id).single();
      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase.from('lessons').select('*').eq('course_id', id).order('id', { ascending: true });
      if (lessonsError) throw lessonsError;

      const loadedLessons = lessonsData || [];
      setLessons(loadedLessons);

      if (loadedLessons.length > 0) {
        // Fetch sessions for all these lessons
        const lessonIds = loadedLessons.map((l: Lesson) => l.id);
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .in('lesson_id', lessonIds)
          .order('id', { ascending: true });

        if (sessionsError) throw sessionsError;

        const localSessionsMap: Record<number, Session[]> = {};
        let firstSessionFound: Session | null = null;

        if (sessionsData) {
          sessionsData.forEach((session: Session) => {
            if (!localSessionsMap[session.lesson_id]) {
              localSessionsMap[session.lesson_id] = [];
            }
            localSessionsMap[session.lesson_id].push(session);

            if (!firstSessionFound) {
              firstSessionFound = session;
            }
          });
        }
        setSessions(localSessionsMap);

        if (loadedLessons[0]) {
          setExpandedLessons([loadedLessons[0].id]);
        }

        if (firstSessionFound) {
          setActiveSession(firstSessionFound);
        }

        // Fetch all materials for this course
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select('*')
          .or(`course_id.eq.${id},lesson_id.in.(${loadedLessons.map(l => l.id).join(',') || 0})`);

        if (materialsError) throw materialsError;

        // Also fetch materials linked directly to sessions of this course
        const sessionIds: number[] = [];
        for (const lessonId in localSessionsMap) {
          localSessionsMap[lessonId].forEach((s: Session) => sessionIds.push(s.id));
        }

        let allFetchedMaterials = materialsData || [];

        if (sessionIds.length > 0) {
          const { data: sessionMaterialsData, error: sessionMaterialsError } = await supabase
            .from('materials')
            .select('*')
            .in('session_id', sessionIds);

          if (sessionMaterialsError) throw sessionMaterialsError;

          // Merge and deduplicate just in case
          const existingIds = new Set(allFetchedMaterials.map(m => m.id));
          const newMaterials = (sessionMaterialsData || []).filter(m => !existingIds.has(m.id));
          allFetchedMaterials = [...allFetchedMaterials, ...newMaterials];
        }

        setAllMaterials(allFetchedMaterials);
      } else {
         // No lessons found, just fetch course-level materials
         const { data: materialsData, error: materialsError } = await supabase
            .from('materials')
            .select('*')
            .eq('course_id', id);
         if (materialsError) throw materialsError;
         setAllMaterials(materialsData || []);
      }

    } catch (err: any) {
      console.error("Error fetching course data:", err);
      alert(`Error loading course: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading course details...</div>;
  }

  if (!course) {
    return <div className="py-10 text-center text-red-500">Course not found.</div>;
  }

  const activeLessonForSession = activeSession ? lessons.find(l => l.id === activeSession.lesson_id) : null;

  // Filter materials based on current view hierarchy
  const relevantMaterials = allMaterials.filter(material => {
    if (!activeSession) {
       // If no active session, only show course-level materials (no lesson or session assigned)
       return material.course_id === Number(id) && !material.lesson_id && !material.session_id;
    }

    // Course-level material (no lesson or session assigned)
    const isCourseMaterial = material.course_id === Number(id) && !material.lesson_id && !material.session_id;

    // Lesson-level material (assigned to this lesson, no session assigned)
    const isLessonMaterial = material.lesson_id === activeSession.lesson_id && !material.session_id;

    // Session-level material (assigned specifically to this session)
    const isSessionMaterial = material.session_id === activeSession.id;

    return isCourseMaterial || isLessonMaterial || isSessionMaterial;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content (Video, Details, & Material Viewer) */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/student/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
              <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 truncate">{activeSession ? activeSession.title : course.title}</h1>
            <p className="text-gray-500 mt-1 truncate">
              {activeLessonForSession ? `${course.title} - ${activeLessonForSession.title}` : course.title}
            </p>
          </div>
          {activeMaterialUrl && (
             <button
                onClick={() => setActiveMaterialUrl(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors flex-shrink-0"
             >
                <X size={16} /> Close Material
             </button>
          )}
        </div>

        {/* Video Player & Material Viewer Split Screen Section */}
        {activeSession ? (
          <div className={`flex flex-col ${activeMaterialUrl ? 'lg:flex-row' : ''} gap-6`}>
            <div className={`shadow-xl rounded-2xl bg-black overflow-hidden flex-shrink-0 ${activeMaterialUrl ? 'w-full lg:w-1/2 xl:w-2/5 h-fit sticky top-6' : 'w-full'}`}>
              <CustomVideoPlayer key={activeSession.id} url={activeSession.youtube_link} />
            </div>

            {activeMaterialUrl && (
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] lg:min-h-0 flex flex-col">
                <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                   <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FileText size={18}/> Material Viewer</h3>
                   <a href={activeMaterialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                     <Download size={16} /> Download Original
                   </a>
                </div>
                <iframe
                  src={activeMaterialUrl}
                  className="w-full flex-1 border-none min-h-[500px]"
                  title="Material Viewer"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl aspect-video flex flex-col items-center justify-center text-gray-500">
            <Video size={48} className="mb-4 opacity-50" />
            <p>No sessions available for this course yet.</p>
          </div>
        )}

        {/* Course Info & Tabs */}
        {activeSession && (
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
                  {relevantMaterials.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No materials available for this session.
                    </div>
                  ) : (
                    relevantMaterials.map(material => {
                      const fileExt = material.file_url.split('.').pop()?.toUpperCase() || 'FILE';
                      return (
                        <div key={material.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-300 transition-colors gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 flex-shrink-0">
                              <FileText size={24} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate" title={material.title}>{material.title}</h4>
                              <p className="text-xs text-gray-500">
                                {fileExt} • {formatFileSize(material.file_size)}
                                {material.course_id && !material.lesson_id && !material.session_id && ' • Course Material'}
                                {material.lesson_id && !material.session_id && ' • Lesson Material'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                            <button
                               onClick={() => {
                                 setActiveMaterialUrl(material.file_url);
                                 window.scrollTo({ top: 0, behavior: 'smooth' });
                               }}
                               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeMaterialUrl === material.file_url ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                               <Eye size={16} /> View
                            </button>
                            <a
                              href={material.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Download size={16} /> Download
                            </a>
                          </div>
                        </div>
                      )
                    })
                  )}
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

      {/* Sidebar (Playlist) - Hide when material is open on desktop, stack on mobile */}
      {!activeMaterialUrl && (
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900">Course Content</h3>
            <p className="text-sm text-gray-500">{lessons.length} lessons</p>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {lessons.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No lessons found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-white">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {lessonIndex + 1}
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">{lesson.title}</h4>
                      </div>
                      {expandedLessons.includes(lesson.id) ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </button>

                    {expandedLessons.includes(lesson.id) && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {!sessions[lesson.id] || sessions[lesson.id].length === 0 ? (
                          <div className="p-4 text-xs text-gray-500 text-center">No sessions available.</div>
                        ) : (
                          sessions[lesson.id].map((session, sessionIndex) => (
                            <button
                              key={session.id}
                              onClick={() => setActiveSession(session)}
                              className={`w-full text-left py-3 pl-12 pr-4 flex items-start gap-3 transition-colors ${
                                activeSession?.id === session.id ? 'bg-blue-50 border-l-4 border-blue-600 pl-11' : 'hover:bg-gray-100 border-l-4 border-transparent'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {activeSession?.id === session.id ? (
                                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                    <Play size={10} className="ml-0.5" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                                    {sessionIndex + 1}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h5 className={`font-medium text-xs ${activeSession?.id === session.id ? 'text-blue-900' : 'text-gray-700'}`}>
                                  {session.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  {!session.is_free && (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-orange-600 bg-orange-50 px-1 py-0.5 rounded">
                                      <Lock size={8} /> Paid
                                    </span>
                                  )}
                                  {session.is_free && (
                                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                                      Free
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CourseView;
