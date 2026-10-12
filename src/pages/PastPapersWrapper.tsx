import React, { useState } from 'react';
import { PastPapersView } from '../components/PastPapersView';
import { PdfReaderModal } from '../components/PdfReaderModal';

const PastPapersWrapper: React.FC = () => {
    const [selectedPaper, setSelectedPaper] = useState<any>(null);

    return (
        <>
            <PastPapersView onSelectPaper={setSelectedPaper} />
            <PdfReaderModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
        </>
    )
}
export default PastPapersWrapper;
