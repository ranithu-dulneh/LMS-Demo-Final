import React, { useState } from 'react';
import { StudyMaterialsStore } from '../components/StudyMaterialsStore';

const StoreWrapper: React.FC = () => {
    return (
        <StudyMaterialsStore onAddToCart={() => {}} />
    )
}
export default StoreWrapper;
