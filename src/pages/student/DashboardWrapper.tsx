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
    const [realUncompletedSessions, setRealUncompletedSessions] = useState<any[]>([]);


    useEffect(() => {
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
               .eq('user_id', authUser?.id);

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
                   .eq('user_id', authUser?.id)
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

             // Fetch full session details for the courses the user has access to
             if (courseIds.length > 0) {
               const { data: fullSessionsData, error: fullSessionsError } = await supabase
                  .from('sessions')
                  .select('*, lessons!inner(course_id, title)')
                  .in('lessons.course_id', courseIds)
                  .order('created_at', { ascending: false });

               if (!fullSessionsError && fullSessionsData) {
                  // Filter out completed sessions
                  const { data: userProgress } = await supabase
                     .from('student_progress')
                     .select('session_id')
                     .eq('user_id', authUser?.id);

                  const completedSessionIds = userProgress ? userProgress.map(p => p.session_id) : [];

                  const uncompletedSessions = fullSessionsData.filter(s => !completedSessionIds.includes(s.id));

                  const mappedSessions = uncompletedSessions.map(s => {
                    return {
                      id: "session-" + s.id.toString(),
                      real_session_id: s.id.toString(),
                      real_lesson_id: s.lesson_id.toString(),
                      real_course_id: s.lessons.course_id.toString(),
                      title: s.title || 'Untitled Session',
                      subtitle: s.lessons?.title || 'Course Session',
                      description: s.description || 'Watch the recording for this session.',
                      duration: s.duration_minutes ? `${s.duration_minutes}m` : '1h 30m',
                      date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      month: new Date(s.created_at).toLocaleString('default', { month: 'long' }),
                      topic: s.lessons?.title || 'General',
                      thumbnailGradient: 'from-blue-600/30 to-indigo-600/20',
                      chapters: [],
                      notesSummary: [],
                      youtube_link: s.youtube_link
                    };
                  });
                  setRealUncompletedSessions(mappedSessions);
               }
             }

          }

          setRealCourses(mappedData);
        } catch (err: any) {
          console.error(err);
        }
        };
        if (authUser) {
            fetchCourses();
        }
    }, [authUser]);

    if (!authUser) {
        return null;
    }

    const currentUser: CurrentUser = {
        id: authUser?.id || "",
        name: authUser?.user_metadata?.full_name || 'Student',
        indexNumber: authUser?.user_metadata?.student_id || 'ID-TBD',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        role: 'Student',
        batch: '2024',
        overallProgress: 0,
        email: authUser?.email || '',
        phone: ''
    };

    return (
        <LMSDashboard
            currentUser={currentUser}

            onSelectVideo={(video: any) => {
              if (video.real_course_id) {
                navigate(`/student/course/${video.real_course_id}?session=${video.real_session_id}`);
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
            overrideVideoModules={realUncompletedSessions}

        />
    )
}
export default DashboardWrapper;
