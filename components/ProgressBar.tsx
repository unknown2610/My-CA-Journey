import React from 'react';

interface ProgressBarProps {
  progress: number;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass = "bg-blue-600" }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
      <div 
        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
};
