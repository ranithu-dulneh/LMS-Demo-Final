import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Download, X, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

interface Course {
  id: number;
  title: string;
}

interface Lesson {
  id: number;
  title: string;
  course_id: number;
}

interface Session {
  id: number;
  title: string;
  lesson_id: number;
}

const AdminMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMaterials();
    fetchHierarchyData();

    // Set up Realtime subscription
    const channel = supabase
      .channel('public:materials')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'materials' },
        () => {
          fetchMaterials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchyData = async () => {
    try {
      const [coursesRes, lessonsRes, sessionsRes] = await Promise.all([
        supabase.from('courses').select('id, title'),
        supabase.from('lessons').select('id, title, course_id'),
        supabase.from('sessions').select('id, title, lesson_id')
      ]);

      if (coursesRes.data) setCourses(coursesRes.data);
      if (lessonsRes.data) setLessons(lessonsRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data);
    } catch (err) {
      console.error('Error fetching hierarchy data:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    try {
      // 1. Get the session (from auth) to pass the token
      await supabase.auth.getSession();

      // 2. Upload file via Edge Function to R2 Storage
      const formData = new FormData();
      formData.append('file', file);

      const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-to-r2', {
        body: formData,
      });

      if (uploadError || !uploadData || !uploadData.publicUrl) {
        throw new Error(uploadError?.message || "Upload failed to return a public URL");
      }

      // 3. Insert record into materials table
      const { error: dbError } = await supabase
        .from('materials')
        .insert([{
          title: title,
          file_url: uploadData.publicUrl,
          file_size: file.size,
          course_id: selectedCourseId ? parseInt(selectedCourseId) : null,
          lesson_id: selectedLessonId ? parseInt(selectedLessonId) : null,
          session_id: selectedSessionId ? parseInt(selectedSessionId) : null,
        }]);

      if (dbError) throw dbError;

      // Reset form and close modal
      closeModal();

    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this material record? (Note: The file will still remain in Google Drive)")) return;

    try {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete material.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setFile(null);
    setSelectedCourseId('');
    setSelectedLessonId('');
    setSelectedSessionId('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter dropdowns based on selections
  const filteredLessons = selectedCourseId
    ? lessons.filter(l => l.course_id.toString() === selectedCourseId)
    : lessons;

  const filteredSessions = selectedLessonId
    ? sessions.filter(s => s.lesson_id.toString() === selectedLessonId)
    : sessions;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={24} className="text-teal-600" /> Manage Materials
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <Upload size={16} /> Upload New
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-gray-500">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : materials.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="font-medium text-gray-900">No materials found</p>
          <p className="text-sm mt-1">Upload files to share with your students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors group">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate" title={material.title}>{material.title}</h4>
                <p className="text-xs text-gray-500 truncate">
                  {formatFileSize(material.file_size)}
                  {material.course_id && ` • Course ID: ${material.course_id}`}
                  {material.lesson_id && ` • Lesson ID: ${material.lesson_id}`}
                  {material.session_id && ` • Session ID: ${material.session_id}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                  title="View/Download"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 md:opacity-0 group-hover:opacity-100"
                  title="Delete Record"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Upload size={20} className="text-blue-600"/> Upload Material
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={uploading}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 2023 Past Paper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Optional Linking</p>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link to Course</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value);
                      setSelectedLessonId('');
                      setSelectedSessionId('');
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
                    disabled={uploading}
                  >
                    <option value="">-- None --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link to Lesson</label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => {
                      setSelectedLessonId(e.target.value);
                      setSelectedSessionId('');
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    disabled={uploading || !selectedCourseId}
                  >
                    <option value="">-- None --</option>
                    {filteredLessons.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link to Session</label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    disabled={uploading || !selectedLessonId}
                  >
                    <option value="">-- None --</option>
                    {filteredSessions.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><Loader2 className="animate-spin" size={18} /> Uploading to R2 Storage...</>
                  ) : (
                    <><Upload size={18} /> Upload Material</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaterials;
