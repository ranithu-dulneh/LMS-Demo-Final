import React, { useState } from 'react';
import { ResultsView } from '../components/ResultsView';
import { WallOfFameModal } from '../components/WallOfFameModal';
import { useNavigate } from 'react-router-dom';

const ResultsWrapper: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRanker, setSelectedRanker] = useState<any>(null);

    return (
        <>
            <ResultsView
                onSelectRanker={setSelectedRanker}
                onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'login') navigate('/login');
                    else if (tab === 'lms') navigate('/student/dashboard');
                    else if (tab === 'past-papers') navigate('/past-papers');
                    else if (tab === 'videos') navigate('/videos');
                    else if (tab === 'store') navigate('/store');
                    else if (tab === 'results') navigate('/results');
                }}
                onOpenEnrollment={() => {}}
            />
            <WallOfFameModal ranker={selectedRanker} onClose={() => setSelectedRanker(null)} />
        </>
    )
}
export default ResultsWrapper;
