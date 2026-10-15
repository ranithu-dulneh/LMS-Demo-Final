import React, { useState } from 'react';
import { LandingPage } from '../components/LandingPage';
import { useNavigate, useOutletContext } from 'react-router-dom';
const initialResultsData: any[] = [];

const LandingPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    const { openSignup } = useOutletContext<{ openSignup: () => void }>();

    return (
        <LandingPage
            onNavigate={(tab) => {
                if (tab === 'home') navigate('/');
                else if (tab === 'login') navigate('/login');
                else if (tab === 'lms') navigate('/student/dashboard');
                else if (tab === 'past-papers') navigate('/past-papers');
                else if (tab === 'videos') navigate('/videos');
                else if (tab === 'store') navigate('/store');
                else if (tab === 'results') navigate('/results');
            }}
            onOpenEnrollment={openSignup}
            onOpenLogin={() => navigate('/login')}
            onSelectRanker={() => {}}
            resultsData={initialResultsData}
        />
    )
}
export default LandingPageWrapper;
