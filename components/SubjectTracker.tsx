import React from 'react';
import { Subject, Status } from '../types';
import { Check, X, Minus } from 'lucide-react';

interface SubjectTrackerProps {
  subject: Subject;
  onUpdate: (id: string, status: Status, marks?: number) => void;
}

export const SubjectTracker: React.FC<SubjectTrackerProps> = ({ subject, onUpdate }) => {
  
  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.Completed: return <Check className="w-4 h-4 text-white" />;
      case Status.Exempted: return <Check className="w-4 h-4 text-white" />;
      case Status.Failed: return <X className="w-4 h-4 text-white" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBg = (status: Status) => {
    switch (status) {
      case Status.Completed: return 'bg-green-500 border-green-600';
      case Status.Exempted: return 'bg-indigo-500 border-indigo-600';
      case Status.Failed: return 'bg-red-500 border-red-600';
      case Status.InProgress: return 'bg-yellow-500 border-yellow-600';
      default: return 'bg-slate-200 border-slate-300 dark:bg-slate-700 dark:border-slate-600';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 mb-2">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${getStatusBg(subject.status)} transition-colors`}>
          {getStatusIcon(subject.status)}
        </div>
        <span className={`text-sm font-medium ${subject.status === Status.Completed ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
          {subject.name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {subject.status === Status.Completed || subject.status === Status.Failed || subject.status === Status.Exempted ? (
          <input
            type="number"
            placeholder="Marks"
            className="w-16 p-1 text-sm border rounded text-center dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            value={subject.marks || ''}
            onChange={(e) => onUpdate(subject.id, subject.status, parseInt(e.target.value))}
            max={100}
          />
        ) : null}
        
        <select
          value={subject.status}
          onChange={(e) => onUpdate(subject.id, e.target.value as Status, subject.marks)}
          className="text-xs p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer hover:border-slate-400"
        >
          <option value={Status.Pending}>Pending</option>
          <option value={Status.InProgress}>Studying</option>
          <option value={Status.Completed}>Passed</option>
          <option value={Status.Exempted}>Exempted</option>
          <option value={Status.Failed}>Failed</option>
        </select>
      </div>
    </div>
  );
};
