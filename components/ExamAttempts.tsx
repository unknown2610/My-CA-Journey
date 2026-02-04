import React, { useState } from 'react';
import { UserData, ExamAttempt, CourseLevel, SubjectResult, AttemptGroup } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ExamAttemptsProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const ExamAttempts: React.FC<ExamAttemptsProps> = ({ userData, setUserData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAttempt, setNewAttempt] = useState<Partial<ExamAttempt>>({
    level: userData.currentLevel,
    term: '',
    groups: []
  });

  // Determine available subjects based on selected level
  const getSubjectsForLevel = (level: CourseLevel) => {
    if (level === CourseLevel.Foundation) return userData.foundation.papers;
    if (level === CourseLevel.Intermediate) return [...userData.intermediate.group1.subjects, ...userData.intermediate.group2.subjects];
    if (level === CourseLevel.Final) return [...userData.final.group1.subjects, ...userData.final.group2.subjects];
    return [];
  };

  const handleAddAttempt = () => {
    if (!newAttempt.term || !newAttempt.level) return;

    const attempt: ExamAttempt = {
      id: Date.now().toString(),
      level: newAttempt.level,
      term: newAttempt.term,
      attemptNumber: (userData.attempts.filter(a => a.level === newAttempt.level).length || 0) + 1,
      groups: newAttempt.groups || []
    };

    setUserData(prev => ({
      ...prev,
      attempts: [attempt, ...prev.attempts]
    }));
    setIsAdding(false);
    setNewAttempt({ level: userData.currentLevel, term: '', groups: [] });
  };

  const handleDeleteAttempt = (id: string) => {
    if (confirm('Are you sure you want to delete this attempt record?')) {
      setUserData(prev => ({
        ...prev,
        attempts: prev.attempts.filter(a => a.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📝</span> Exam History
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Log Attempt
        </button>
      </div>

      {/* Add Attempt Form */}
      {isAdding && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Log New Exam Attempt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Level</label>
              <select 
                value={newAttempt.level}
                onChange={(e) => setNewAttempt({...newAttempt, level: e.target.value as CourseLevel, groups: []})}
                className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 dark:text-white"
              >
                {Object.values(CourseLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Term (e.g. May 2024)</label>
              <input 
                type="text"
                value={newAttempt.term}
                onChange={(e) => setNewAttempt({...newAttempt, term: e.target.value})}
                placeholder="e.g. May 2024"
                className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>

          {/* Group Results Input */}
          <div className="space-y-4">
             <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium mb-2">Subject Marks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                   {getSubjectsForLevel(newAttempt.level as CourseLevel).map(subject => {
                      const currentVal = newAttempt.groups?.flatMap(g => g.subjects).find(s => s.subjectId === subject.id)?.marks;
                      
                      return (
                        <div key={subject.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                           <span className="truncate pr-2">{subject.name}</span>
                           <input 
                              type="number" 
                              placeholder="Marks"
                              max="100"
                              className="w-16 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                              onChange={(e) => {
                                 const marks = parseInt(e.target.value) || 0;
                                 const isExempt = marks >= 60;
                                 
                                 // Simple logic to add subjects to a generic group for now
                                 // Ideally we split by groups defined in constants, but for logging we just aggregate
                                 const updatedGroups = [...(newAttempt.groups || [])];
                                 let defaultGroup = updatedGroups.find(g => g.name === 'Result');
                                 if (!defaultGroup) {
                                    defaultGroup = { name: 'Result', status: 'Fail', subjects: [], totalMarks: 0 };
                                    updatedGroups.push(defaultGroup);
                                 }
                                 
                                 const existingSubIndex = defaultGroup.subjects.findIndex(s => s.subjectId === subject.id);
                                 if (existingSubIndex >= 0) {
                                    defaultGroup.subjects[existingSubIndex].marks = marks;
                                    defaultGroup.subjects[existingSubIndex].isExempt = isExempt;
                                 } else {
                                    defaultGroup.subjects.push({
                                       subjectId: subject.id,
                                       subjectName: subject.name,
                                       marks,
                                       isExempt
                                    });
                                 }
                                 
                                 // Recalculate Total
                                 defaultGroup.totalMarks = defaultGroup.subjects.reduce((sum, s) => sum + s.marks, 0);
                                 // Basic Pass Logic (Simplified: need 40 each, 50% agg)
                                 const allPassed = defaultGroup.subjects.every(s => s.marks >= 40);
                                 const aggPassed = (defaultGroup.totalMarks / (defaultGroup.subjects.length * 100)) >= 0.5;
                                 defaultGroup.status = (allPassed && aggPassed) ? 'Pass' : 'Fail';

                                 setNewAttempt({...newAttempt, groups: updatedGroups});
                              }}
                           />
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
            <button onClick={handleAddAttempt} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Attempt</button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {userData.attempts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p>No exam attempts logged yet.</p>
          </div>
        ) : (
          userData.attempts.map((attempt) => (
            <AttemptCard key={attempt.id} attempt={attempt} onDelete={() => handleDeleteAttempt(attempt.id)} />
          ))
        )}
      </div>
    </div>
  );
};

const AttemptCard: React.FC<{ attempt: ExamAttempt; onDelete: () => void }> = ({ attempt, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const totalMarks = attempt.groups.reduce((sum, g) => sum + g.totalMarks, 0);
  const status = attempt.groups.some(g => g.status === 'Pass') ? 'Pass' : 'Fail'; // Simplified status logic

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => setExpanded(!expanded)}>
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {status === 'Pass' ? 'P' : 'F'}
            </div>
            <div>
               <h4 className="font-semibold text-slate-800 dark:text-white">{attempt.level} <span className="text-slate-400 font-normal">• Attempt #{attempt.attemptNumber}</span></h4>
               <p className="text-sm text-slate-500">{attempt.term}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <span className="block text-xs text-slate-500 uppercase">Total</span>
               <span className="font-bold text-slate-700 dark:text-slate-200">{totalMarks}</span>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
         </div>
      </div>
      
      {expanded && (
         <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {attempt.groups.map((group, idx) => (
               <div key={idx} className="mb-3 last:mb-0">
                  <div className="space-y-2">
                     {group.subjects.map((sub, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-sm">
                           <span className="text-slate-600 dark:text-slate-300">{sub.subjectName}</span>
                           <div className="flex items-center gap-2">
                              {sub.isExempt && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded">Exempt</span>}
                              <span className={`font-medium w-8 text-right ${sub.marks < 40 ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>{sub.marks}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
               <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete Record
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
