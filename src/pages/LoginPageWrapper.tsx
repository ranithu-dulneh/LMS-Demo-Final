import React, { useState, useEffect } from 'react';
import { StudentLoginPortal } from '../components/StudentLoginPortal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { InstitutionSelectModal } from '../components/InstitutionSelectModal';
import { EnrollmentModal } from '../components/EnrollmentModal';

const LoginPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    const { openSignup } = useOutletContext<{ openSignup: () => void }>();
    const { deviceError } = useAuth();
    const [authError, setAuthError] = useState('');
    const [institutionSelectOpen, setInstitutionSelectOpen] = useState(false);
    const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState<any>(null);

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
            const { error } = await supabase.auth.signInWithPassword({
                email: identifier, // Assuming identifier is mapped to email for now, or users enter email
                password: pass,
            });

            if (error) throw error;
            navigate('/student/dashboard');
            return null; // Return null error on success
        } catch (err: any) {
            let errorMsg = err.message || 'Invalid credentials.';
            if (err.message === 'Failed to fetch') {
                errorMsg = 'Network error: Failed to fetch. Please check your internet connection.';
            }
            return errorMsg; // Return error to be displayed inside the component
        }
    };

    return (
        <>
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
                onOpenSignUp={() => setInstitutionSelectOpen(true)}
                overrideLogin={handleRealLogin}
                externalError={authError}
            />

            <InstitutionSelectModal
                isOpen={institutionSelectOpen}
                onClose={() => setInstitutionSelectOpen(false)}
                onSelectInstitute={(inst) => {
                    setSelectedInstitution(inst);
                    setInstitutionSelectOpen(false);
                    setEnrollmentModalOpen(true);
                }}
            />

            <EnrollmentModal
                isOpen={enrollmentModalOpen}
                onClose={() => setEnrollmentModalOpen(false)}
                selectedInstitute={selectedInstitution}
                onChangeInstitute={() => {
                    setEnrollmentModalOpen(false);
                    setInstitutionSelectOpen(true);
                }}
            />
        </>
    )
}
export default LoginPageWrapper;
