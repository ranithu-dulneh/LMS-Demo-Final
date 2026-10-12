import React, { useState, useEffect } from 'react';
import { LMSDashboard } from '../../components/LMSDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from '../../types';

const DashboardWrapper: React.FC = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    // We will mimic the LMSDashboard's internal behavior but replace or combine its mock courses
    // with actual ones fetched from the database, similar to original Dashboard.tsx.

    const [realCourses, setRealCourses] = useState<any[]>([]);
    const [realVideos, setRealVideos] = useState<any[]>([]);

    useEffect(() => {
        if (authUser) {
            fetchCourses();
        }
    }, [authUser]);

    const fetchCourses = async () => {
        try {
          const { data: allCourses, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('status', 'Active')
            .order('id', { ascending: false });

          if (coursesError) throw coursesError;

          let myCourseIds: number[] = [];
          if (authUser && !authUser.is_admin) {
             const { data: enrollments, error: enrollError } = await supabase
               .from('enrollments')
               .select('course_id')
               .eq('user_id', authUser.id);

             if (!enrollError && enrollments) {
               myCourseIds = enrollments.map(e => e.course_id);
             }
          }

          const accessibleCourses = allCourses?.filter(c =>
             c.visibility === 'public' ||
             myCourseIds.includes(c.id) ||
             authUser?.is_admin
          ) || [];

          let mappedData: any[] = [];
          if (accessibleCourses.length > 0) {
             const courseIds = accessibleCourses.map(c => c.id);
             const { data: sessionCountsData } = await supabase
                .from('sessions')
                .select('id, lesson_id, lessons!inner(course_id)')
                .in('lessons.course_id', courseIds);

             const courseSessionTotals: Record<number, number> = {};
             if (sessionCountsData) {
                sessionCountsData.forEach((s: any) => {
                   const cId = s.lessons.course_id;
                   courseSessionTotals[cId] = (courseSessionTotals[cId] || 0) + 1;
                });
             }

             let completedCounts: Record<number, number> = {};
             if (authUser) {
                const { data: progressData } = await supabase
                   .from('student_progress')
                   .select('course_id')
                   .eq('user_id', authUser.id)
                   .in('course_id', courseIds);

                if (progressData) {
                   progressData.forEach(p => {
                      completedCounts[p.course_id] = (completedCounts[p.course_id] || 0) + 1;
                   });
                }
             }

             mappedData = accessibleCourses.map((c: any) => {
               const totalSessions = courseSessionTotals[c.id] || 0;
               const completedSessions = completedCounts[c.id] || 0;
               const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

               return {
                 id: "real-" + c.id.toString(),
                 course_id: c.id.toString(),
                 batch: "A/L " + (c.exam_year || '2026'),
                 month: c.title.split('-')[0] || c.title, // Just using title as month/name placeholder
                 title: c.title,
                 priceLKR: c.price || 3000,
                 description: c.description || 'Course loaded from database',
                 isUnlocked: c.visibility === 'public' || myCourseIds.includes(c.id) || authUser?.is_admin,
                 videoCount: totalSessions,
                 tuteCount: 0
               };
             });
          }

          setRealCourses(mappedData);

          // --- Fetch real sessions for the My Lessons / Videos view ---
          if (accessibleCourses.length > 0) {
              const accessibleCourseIds = accessibleCourses.map(c => c.id);
              const { data: allSessions } = await supabase
                .from('sessions')
                .select('id, title, description, video_url, created_at, lessons!inner(title, course_id)')
                .in('lessons.course_id', accessibleCourseIds)
                .order('created_at', { ascending: false });

              if (allSessions) {
                  const mappedVideos = allSessions.map((s: any) => ({
                      id: "real-session-" + s.id,
                      title: s.title,
                      subtitle: s.lessons?.title || 'Lesson',
                      description: s.description || 'Session loaded from database',
                      duration: 'On-Demand',
                      date: new Date(s.created_at).toLocaleDateString(),
                      topic: s.lessons?.title || 'General',
                      thumbnailGradient: 'from-blue-600/30 to-indigo-600/20',
                      chapters: [],
                      notesSummary: [],
                      video_url: s.video_url, // passing original url just in case
                      course_id: s.lessons?.course_id // useful for navigation
                  }));
                  setRealVideos(mappedVideos);
              }
          }
        } catch (err: any) {
          console.error(err);
        }
    };

    if (!authUser) {
        return null;
    }

    const currentUser: CurrentUser = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || 'Student',
        indexNumber: authUser.user_metadata?.student_id || 'ID-TBD',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        role: 'Student',
        batch: '2024',
        overallProgress: 0,
        email: authUser.email || '',
        phone: ''
    };

    return (
        <LMSDashboard
            currentUser={currentUser}
            onSelectVideo={(video) => {
                if ((video as any).course_id) {
                    navigate('/student/course/' + (video as any).course_id);
                }
            }}
            onSelectPaper={() => {}}
            onAddToCart={() => {}}
            onNavigate={(tab: string) => {
                if (tab.startsWith('course-')) navigate('/student/course/' + tab.split('-')[1]);
                else if (tab === 'home') navigate('/');
                else if (tab === 'login') navigate('/login');
                else if (tab === 'lms') navigate('/student/dashboard');
                else if (tab === 'past-papers') navigate('/past-papers');
                else if (tab === 'videos') navigate('/videos');
                else if (tab === 'store') navigate('/store');
                else if (tab === 'results') navigate('/results');
            }}
            overrideCourses={realCourses}
            overrideVideos={realVideos}
        />
    )
}
export default DashboardWrapper;
