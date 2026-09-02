import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, BookOpen, X, MonitorSmartphone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface StudentProfile {
  id: string;
  student_id: string;
  full_name: string;
  is_approved: boolean;
  created_at: string;
  max_devices: number;
  enrollment_count?: number;
}

const AdminStudents: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(filterParam || 'All');

  useEffect(() => {
    fetchStudents();

    // In a real app we might subscribe to realtime changes here
    const channel = supabase.channel('public:student_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_profiles' }, fetchStudents)
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          enrollments (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        const mappedData = (data || []).map(student => ({
          ...student,
          enrollment_count: student.enrollments[0]?.count || 0
        }));
        setStudents(mappedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<{ id: number, title: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const fetchAssignableCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title').eq('visibility', 'assignable');
    if (data) setCourses(data);
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state instead of refetching for speed (realtime will also catch this)
      setStudents(students.map(s => s.id === id ? { ...s, is_approved: !currentStatus } : s));
    } catch (error: any) {
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const updateDeviceLimit = async (id: string, currentLimit: number) => {
    try {
      const newLimit = currentLimit === 1 ? 2 : 1;
      const { error } = await supabase
        .from('student_profiles')
        .update({ max_devices: newLimit })
        .eq('id', id);

      if (error) throw error;

      setStudents(students.map(s => s.id === id ? { ...s, max_devices: newLimit } : s));
      alert(`Device limit updated to ${newLimit}.`);
    } catch (error: any) {
      alert(`Failed to update device limit: ${error.message}`);
    }
  };

  const openAssignModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    fetchAssignableCourses();
    setIsAssignModalOpen(true);
  };

  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourseId) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ user_id: selectedStudent.id, course_id: parseInt(selectedCourseId) }]);

      if (error) {
        if (error.code === '23505') {
          alert('Student is already enrolled in this course.');
        } else {
          throw error;
        }
      } else {
        alert('Course assigned successfully!');
        setIsAssignModalOpen(false);
      }
    } catch (error: any) {
      alert(`Failed to assign course: ${error.message}`);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student_id?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'Approved') return s.is_approved;
    if (activeFilter === 'Pending') return !s.is_approved;
    if (activeFilter === 'Unassigned') return s.is_approved && s.enrollment_count === 0;

    return true; // 'All'
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={24} className="text-blue-600" /> Manage Students
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-transparent border-none outline-none py-2 text-sm font-medium text-gray-700"
            >
              <option value="All">All Students</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Unassigned">Unassigned (0 Courses)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-3 font-medium">Student ID</th>
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Status & Devices</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading students...</td></tr>
            ) : filteredStudents.length === 0 ? (
               <tr><td colSpan={4} className="py-8 text-center text-gray-500">No students found.</td></tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-700">{student.student_id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                        {student.full_name?.substring(0, 2) || 'ST'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-xs text-gray-500">Joined {format(new Date(student.created_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1 items-start">
                      {student.is_approved ? (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                          <CheckCircle size={12} /> Approved
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                          Pending
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MonitorSmartphone size={12} />
                        <span className="font-medium text-gray-700">{student.max_devices}</span> allowed
                      </div>

                      {student.is_approved && student.enrollment_count === 0 && (
                        <span className="text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button
                      onClick={() => updateDeviceLimit(student.id, student.max_devices)}
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200"
                    >
                      {student.max_devices === 1 ? '+ Allow 2nd Device' : 'Limit to 1 Device'}
                    </button>
                    <button
                      onClick={() => toggleApproval(student.id, student.is_approved)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                        student.is_approved
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-green-600 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {student.is_approved ? 'Revoke Access' : 'Approve'}
                    </button>
                    <button
                      onClick={() => openAssignModal(student)}
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                    >
                      Assign Course
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Course Modal */}
      {isAssignModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden m-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-blue-600" size={20}/> Assign Course
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAssignCourse} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                Assigning course to: <span className="font-bold">{selectedStudent.full_name}</span> ({selectedStudent.student_id})
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="" disabled>Select a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">No assignable courses found. Please create a course and set its visibility to 'assignable'.</p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCourseId}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
