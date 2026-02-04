import React from 'react';
import { TrainingModule, Status } from '../types';
import { StatusBadge } from './StatusBadge';
import { CheckCircle, Clock, Calendar } from 'lucide-react';

interface TrainingCardProps {
  module: TrainingModule;
  startDate?: string;
  endDate?: string;
  onUpdateStatus: (status: Status) => void;
  onUpdateDates: (start: string, end: string) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ module, startDate, endDate, onUpdateStatus, onUpdateDates }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {module.name}
            {module.status === Status.Completed && <CheckCircle className="w-4 h-4 text-green-500" />}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Duration: {module.duration}
          </p>
        </div>
        <StatusBadge status={module.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Status</label>
          <select 
            value={module.status}
            onChange={(e) => onUpdateStatus(e.target.value as Status)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.values(Status).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        {module.status !== Status.Pending && (
          <div className="space-y-2">
             <div>
                <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date</label>
                <input 
                  type="date" 
                  value={startDate || ''}
                  onChange={(e) => onUpdateDates(e.target.value, endDate || '')}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-1 text-slate-700 dark:text-slate-300"
                />
             </div>
             <div>
                <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Completion Date</label>
                <input 
                  type="date" 
                  value={endDate || ''}
                  onChange={(e) => onUpdateDates(startDate || '', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-1 text-slate-700 dark:text-slate-300"
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
