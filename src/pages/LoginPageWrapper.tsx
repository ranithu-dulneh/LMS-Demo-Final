import React, { useState, useEffect } from 'react';
import { StudentLoginPortal } from '../components/StudentLoginPortal';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const LoginPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    const { deviceError } = useAuth();
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') === 'unauthorized') {
            setAuthError('Error: Please log in first to access the LMS.');
        }
    }, []);

    useEffect(() => {
        if (deviceError) {
            setAuthError(deviceError);
        }
    }, [deviceError]);

    // This overrides the mock login behavior inside the StudentLoginPortal
    const handleRealLogin = async (identifier: string, pass: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: identifier,
                password: pass,
            });

            if (error) throw error;

            // Check if admin
            if (data.user) {
                const { data: adminData } = await supabase
                    .from('admin_users')
                    .select('id')
                    .eq('user_id', data.user.id)
                    .limit(1);

                if (adminData && adminData.length > 0) {
                    navigate('/admin');
                    return null;
                }
            }

            navigate('/student/dashboard');
            return null;
        } catch (err: any) {
            let errorMsg = err.message || 'Invalid credentials.';
            if (err.message === 'Failed to fetch') {
                errorMsg = 'Network error: Failed to fetch. Please check your internet connection.';
            }
            return errorMsg; // Return error to be displayed inside the component
        }
    };

    return (
        <StudentLoginPortal
            selectedInstitute={null}
            onNavigate={(tab) => {
                if (tab === 'home') navigate('/');
                else if (tab === 'login') navigate('/login');
                else if (tab === 'lms') navigate('/student/dashboard');
                else if (tab === 'past-papers') navigate('/past-papers');
                else if (tab === 'videos') navigate('/videos');
                else if (tab === 'store') navigate('/store');
                else if (tab === 'results') navigate('/results');
            }}
            onOpenSignUp={() => {}}
            overrideLogin={handleRealLogin}
            externalError={authError}
        />
    )
}
export default LoginPageWrapper;
