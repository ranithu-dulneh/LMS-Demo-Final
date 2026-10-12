import React, { useState } from 'react';
import { VideoModulesView } from '../components/VideoModulesView';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

const VideosWrapper: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    return (
        <>
            <VideoModulesView onSelectVideo={setSelectedVideo} />
            <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        </>
    )
}
export default VideosWrapper;
