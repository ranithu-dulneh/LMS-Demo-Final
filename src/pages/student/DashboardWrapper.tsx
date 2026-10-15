import React, { useState, useEffect } from 'react';
import { LMSDashboard } from '../../components/LMSDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CurrentUser, VideoModule } from '../../types';

const DashboardWrapper: React.FC = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    // We will mimic the LMSDashboard's internal behavior but replace or combine its mock courses
    // with actual ones fetched from the database, similar to original Dashboard.tsx.

    const [realCourses, setRealCourses] = useState<any[]>([]);
    const [myLessons, setMyLessons] = useState<VideoModule[]>([]);

    useEffect(() => {
        if (authUser) {
            fetchCourses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

          // Now fetch uncompleted sessions for "My Lessons"
          if (accessibleCourses.length > 0) {
              const courseIds = accessibleCourses.map(c => c.id);

              // Get all sessions for accessible courses
              const { data: sessionsData, error: sessionsError } = await supabase
                  .from('sessions')
                  .select('id, title, created_at, price, lesson_id, lessons!inner(title, course_id, courses!inner(title, exam_year))')
                  .in('lessons.course_id', courseIds)
                  .order('created_at', { ascending: false });

              if (!sessionsError && sessionsData) {
                  // Filter out completed sessions based on progressData
                  const completedSessionIds = new Set();
                  if (authUser) {
                      const { data: pData } = await supabase
                          .from('student_progress')
                          .select('session_id')
                          .eq('user_id', authUser.id)
                          .in('course_id', courseIds);
                      if (pData) {
                          pData.forEach(p => completedSessionIds.add(p.session_id));
                      }
                  }

                  const uncompletedSessions = sessionsData.filter(s => !completedSessionIds.has(s.id));


                  const mappedLessons: VideoModule[] = uncompletedSessions.map(s => {
                      // Handle potential array or object format from PostgREST join
                      const lessonObj = Array.isArray(s.lessons) ? s.lessons[0] : s.lessons;
                      const courseObj = lessonObj ? (Array.isArray(lessonObj.courses) ? lessonObj.courses[0] : lessonObj.courses) : null;

                      const courseTitle = courseObj?.title || 'Course';
                      const lessonTitle = lessonObj?.title || 'Lesson';

                      return {
                          id: `session-${s.id}`,
                          title: s.title,
                          subtitle: lessonTitle,
                          description: `Part of ${courseTitle}`,
                          duration: '45 mins', // Placeholder as we don't have this in DB currently
                          date: new Date(s.created_at).toLocaleDateString(),
                          month: new Date(s.created_at).toLocaleString('default', { month: 'long' }),
                          topic: courseTitle,
                          thumbnailGradient: 'from-blue-900 via-slate-900 to-indigo-950', // Default gradient
                          chapters: [],
                          notesSummary: []
                      };
                  });


                  setMyLessons(mappedLessons);
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
            onSelectVideo={() => {}}
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
            overrideMyLessons={myLessons}
        />
    )
}
export default DashboardWrapper;
