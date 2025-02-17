import React from 'react';
import {ProgressBar, ProgressContainer} from "@/app/components/ui/progress/Progress.styled";

interface ProgressProps {
    value: number; // Percentual concluído (0-100)
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
    return (
        <ProgressContainer className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
            <ProgressBar
                value={value}
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </ProgressContainer>
    );
};

export default Progress;
