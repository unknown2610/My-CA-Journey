import React, { useMemo, useState, useEffect } from 'react';
import { UserData, CourseLevel, EntryRoute, Status, Subject } from '../types';
import { ProgressBar } from './ProgressBar';
import { SubjectTracker } from './SubjectTracker';
import { TrainingCard } from './TrainingCard';
import { Timeline } from './Timeline';
import { ExamAttempts } from './ExamAttempts';
import { PeersExplorer } from './PeersExplorer';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { BookOpen, GraduationCap, Briefcase, Award, TrendingUp, AlertCircle, Map, Layout, Users } from 'lucide-react';

interface DashboardProps {
  userData: UserData;
  setUserData?: React.Dispatch<React.SetStateAction<UserData>>;
  isReadOnly?: boolean; // For viewing peers
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, setUserData, isReadOnly = false }) => {
  const [viewMode, setViewMode] = useState<'track' | 'visual' | 'peers'>('track');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a random quote on mount
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  // Helper to auto-calculate status based on subjects
  const calculateGroupStatus = (subjects: Subject[]): Status => {
    const isAllPassed = subjects.every(s => s.status === Status.Completed || s.status === Status.Exempted);
    if (isAllPassed) return Status.Completed;
    
    const isAnyFailed = subjects.some(s => s.status === Status.Failed);
    if (isAnyFailed) return Status.Failed;

    const isAnyProgress = subjects.some(s => s.status === Status.InProgress || s.status === Status.Completed || s.status === Status.Exempted);
    if (isAnyProgress) return Status.InProgress;
    
    return Status.Pending;
  };

  // Safe helper to update state only if not read-only
  const handleUpdate = (updater: (prev: UserData) => UserData) => {
    if (!isReadOnly && setUserData) {
      setUserData(updater);
    }
  };

  const updateFoundationSubject = (id: string, status: Status, marks?: number) => {
    handleUpdate(prev => {
      const newPapers = prev.foundation.papers.map(p => p.id === id ? { ...p, status, marks } : p);
      return { ...prev, foundation: { ...prev.foundation, papers: newPapers, status: calculateGroupStatus(newPapers) } };
    });
  };

  const updateInterSubject = (groupId: 'group1' | 'group2', subjectId: string, status: Status, marks?: number) => {
    handleUpdate(prev => {
      const newSubjects = prev.intermediate[groupId].subjects.map(s => s.id === subjectId ? { ...s, status, marks } : s);
      return { ...prev, intermediate: { ...prev.intermediate, [groupId]: { ...prev.intermediate[groupId], subjects: newSubjects, status: calculateGroupStatus(newSubjects) } } };
    });
  };

  const updateSPOM = (setId: 'setA' | 'setB' | 'setC' | 'setD', status: Status, marks?: number) => {
    handleUpdate(prev => ({ ...prev, selfPacedModules: { ...prev.selfPacedModules, [setId]: { ...prev.selfPacedModules[setId], status, marks } } }));
  }

  const updateFinalSubject = (groupId: 'group1' | 'group2', subjectId: string, status: Status, marks?: number) => {
    handleUpdate(prev => {
      const newSubjects = prev.final[groupId].subjects.map(s => s.id === subjectId ? { ...s, status, marks } : s);
      return { ...prev, final: { ...prev.final, [groupId]: { ...prev.final[groupId], subjects: newSubjects, status: calculateGroupStatus(newSubjects) } } };
    });
  };

  const handleArticleshipStart = (date: string) => {
    if(!date) return;
    const startDate = new Date(date);
    // Add 2 years for end date
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 2);
    
    handleUpdate(prev => ({
      ...prev,
      articleship: {
        ...prev.articleship,
        startDate: date,
        endDate: endDate.toISOString().split('T')[0]
      }
    }));
  };

  const stats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;

    // Foundation
    if (userData.entryRoute === EntryRoute.Foundation) {
      totalItems += 4;
      completedItems += userData.foundation.papers.filter(p => p.status === Status.Completed).length;
    }

    // Inter
    totalItems += 7;
    completedItems += userData.intermediate.group1.subjects.filter(s => s.status === Status.Completed || s.status === Status.Exempted).length;
    completedItems += userData.intermediate.group2.subjects.filter(s => s.status === Status.Completed || s.status === Status.Exempted).length;
    if (userData.intermediate.icitss.status === Status.Completed) completedItems++;

    // Articleship
    totalItems += 1;
    if (userData.articleship.status === Status.Completed) completedItems++;

    // SPOM
    totalItems += 4;
    if (userData.selfPacedModules.setA.status === Status.Completed) completedItems++;
    if (userData.selfPacedModules.setB.status === Status.Completed) completedItems++;
    if (userData.selfPacedModules.setC.status === Status.Completed) completedItems++;
    if (userData.selfPacedModules.setD.status === Status.Completed) completedItems++;

    // Final
    totalItems += 7;
    completedItems += userData.final.group1.subjects.filter(s => s.status === Status.Completed || s.status === Status.Exempted).length;
    completedItems += userData.final.group2.subjects.filter(s => s.status === Status.Completed || s.status === Status.Exempted).length;
    if (userData.final.advIcitss.status === Status.Completed) completedItems++;

    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  }, [userData]);

  const currentStageEmoji = () => {
    if (userData.final.group1.status === Status.Completed && userData.final.group2.status === Status.Completed && userData.articleship.status === Status.Completed) return "🎓";
    if (userData.currentLevel === CourseLevel.Final) return "🏔️";
    if (userData.currentLevel === CourseLevel.Intermediate) return "🏃";
    return "🌱";
  };

  if (viewMode === 'peers' && !isReadOnly) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold dark:text-white">Community Peers</h1>
            <button 
                onClick={() => setViewMode('track')}
                className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
        <PeersExplorer />
      </div>
    );
  }

  // Visualization Mode (Full Screen Timeline)
  if (viewMode === 'visual') {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                    <Map className="w-6 h-6 text-blue-600" /> Career Roadmap
                </h2>
                <button 
                    onClick={() => setViewMode('track')}
                    className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Back to Tracker
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <Timeline userData={userData} />
            </div>

            <div className="mt-8 text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="text-indigo-800 dark:text-indigo-200 italic font-medium">"{quote}"</p>
            </div>
        </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 ${isReadOnly ? 'pointer-events-none opacity-90' : ''}`}>
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-icai-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Hello, {userData.name} {currentStageEmoji()}
            </h1>
            <p className="text-blue-100 opacity-90 mb-6 flex gap-2 items-center">
               <span>{userData.state}</span> • <span>{userData.entryRoute}</span>
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-blue-200">Total CA Journey Completed</span>
                <span className="text-2xl font-bold">{stats}%</span>
              </div>
              <ProgressBar progress={stats} colorClass="bg-icai-gold" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div className="flex flex-col gap-4">
            {/* Action Buttons (Only visible if not read-only) */}
            {!isReadOnly && (
                <div className="grid grid-cols-2 gap-4 h-full">
                    <button 
                        onClick={() => setViewMode('visual')}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <Map className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Visualize Path</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('peers')}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <Users className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">View Peers</span>
                    </button>
                </div>
            )}
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30 flex-1 flex items-center justify-center text-center">
                 <p className="text-sm italic text-amber-800 dark:text-amber-200">"{quote}"</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Timeline */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <div className="sticky top-24">
             <Timeline userData={userData} />
          </div>
        </div>

        {/* Center/Right Column: Main Tracker */}
        <div className="xl:col-span-3 order-1 xl:order-2 space-y-8">
          
          {/* Foundation Section */}
          {userData.entryRoute === EntryRoute.Foundation && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Foundation Course</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Papers</h3>
                  {userData.foundation.papers.map(subject => (
                    <SubjectTracker key={subject.id} subject={subject} onUpdate={updateFoundationSubject} />
                  ))}
                </div>
                {/* Only show requirement if not completed */}
                {calculateGroupStatus(userData.foundation.papers) !== Status.Completed && (
                    <div className="bg-blue-50 dark:bg-slate-800/50 p-5 rounded-xl border border-dashed border-blue-200 dark:border-slate-600 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Requirement</p>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Pass Class XII + 4 Months Study Period to appear for Foundation Exam.
                        </p>
                    </div>
                    </div>
                )}
              </div>
            </section>
          )}

          {/* Intermediate Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Intermediate Course</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Group 1</h3>
                {userData.intermediate.group1.subjects.map(subject => (
                  <SubjectTracker key={subject.id} subject={subject} onUpdate={(id, s, m) => updateInterSubject('group1', id, s, m)} />
                ))}
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Group 2</h3>
                {userData.intermediate.group2.subjects.map(subject => (
                  <SubjectTracker key={subject.id} subject={subject} onUpdate={(id, s, m) => updateInterSubject('group2', id, s, m)} />
                ))}
              </div>
            </div>
            {/* ICITSS Training */}
            <div className="mt-4">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 ml-1">Mandatory Training (Pre-Articleship)</h3>
               <TrainingCard 
                  module={userData.intermediate.icitss} 
                  startDate={userData.intermediate.icitss.startDate}
                  endDate={userData.intermediate.icitss.endDate}
                  onUpdateStatus={(s) => handleUpdate(prev => ({...prev, intermediate: {...prev.intermediate, icitss: {...prev.intermediate.icitss, status: s}}}))}
                  onUpdateDates={(start, end) => handleUpdate(prev => ({...prev, intermediate: {...prev.intermediate, icitss: {...prev.intermediate.icitss, startDate: start, endDate: end}}}))}
               />
            </div>
          </section>

          {/* Practical Training Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Practical Training (Articleship)</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">2 Years Mandatory Training</h3>
                      <p className="text-sm text-slate-500 mb-4">Must complete ICITSS and pass Intermediate Groups before commencing.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="text-xs font-semibold text-slate-500 uppercase">Start Date</label>
                              <input type="date" 
                                  value={userData.articleship.startDate || ''}
                                  onChange={(e) => handleArticleshipStart(e.target.value)}
                                  className="w-full mt-1 p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                  disabled={isReadOnly}
                              />
                          </div>
                          <div>
                              <label className="text-xs font-semibold text-slate-500 uppercase">End Date (Auto-calculated)</label>
                              <input type="date" 
                                  value={userData.articleship.endDate || ''}
                                  onChange={(e) => handleUpdate(prev => ({...prev, articleship: {...prev.articleship, endDate: e.target.value}}))}
                                  className="w-full mt-1 p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                  disabled={isReadOnly}
                              />
                          </div>
                      </div>

                      <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" 
                                  checked={userData.articleship.status === Status.Completed}
                                  onChange={(e) => handleUpdate(prev => ({...prev, articleship: {...prev.articleship, status: e.target.checked ? Status.Completed : Status.InProgress}}))}
                                  className="w-4 h-4 text-blue-600 rounded"
                                  disabled={isReadOnly}
                              />
                              <span className="text-sm font-medium">Training Completed</span>
                          </label>
                          
                          <div className="flex items-center gap-2 ml-4">
                              <span className="text-sm">Leaves Taken:</span>
                              <input type="number" 
                                  value={userData.articleship.leavesTaken}
                                  onChange={(e) => handleUpdate(prev => ({...prev, articleship: {...prev.articleship, leavesTaken: parseInt(e.target.value)}}))}
                                  className="w-16 p-1 text-center border rounded dark:bg-slate-900 dark:border-slate-600"
                                  disabled={isReadOnly}
                              />
                          </div>
                      </div>
                  </div>
                  
                  <div className="w-full md:w-1/3 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                      <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                              <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm">Industrial Training Option</h4>
                              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                                  Eligible in the last 9-12 months of articleship. Only for Final students.
                              </p>
                              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                  <input type="checkbox" 
                                      checked={userData.articleship.industrialTraining}
                                      onChange={(e) => handleUpdate(prev => ({...prev, articleship: {...prev.articleship, industrialTraining: e.target.checked}}))}
                                      className="w-4 h-4 text-orange-600 rounded"
                                      disabled={isReadOnly}
                                  />
                                  <span className="text-xs font-medium text-orange-800 dark:text-orange-200">Opted for Industrial Training</span>
                              </label>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </section>

          {/* SPOM Section */}
          <section>
              <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Self-Paced Online Modules (SPOM)</h2>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 mb-4">Must qualify these online modules (Sets A, B, C, D) before appearing for Final Examination. Minimum 50% marks required.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SubjectTracker subject={userData.selfPacedModules.setA} onUpdate={(id, s, m) => updateSPOM('setA', s, m)} />
                      <SubjectTracker subject={userData.selfPacedModules.setB} onUpdate={(id, s, m) => updateSPOM('setB', s, m)} />
                      <SubjectTracker subject={userData.selfPacedModules.setC} onUpdate={(id, s, m) => updateSPOM('setC', s, m)} />
                      <SubjectTracker subject={userData.selfPacedModules.setD} onUpdate={(id, s, m) => updateSPOM('setD', s, m)} />
                  </div>
              </div>
          </section>

          {/* Final Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Final Course</h2>
            </div>
            
            {/* Adv ICITSS */}
            <div className="mb-6">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 ml-1">Mandatory Training (Before Final Exam)</h3>
               <TrainingCard 
                  module={userData.final.advIcitss} 
                  startDate={userData.final.advIcitss.startDate}
                  endDate={userData.final.advIcitss.endDate}
                  onUpdateStatus={(s) => handleUpdate(prev => ({...prev, final: {...prev.final, advIcitss: {...prev.final.advIcitss, status: s}}}))}
                  onUpdateDates={(start, end) => handleUpdate(prev => ({...prev, final: {...prev.final, advIcitss: {...prev.final.advIcitss, startDate: start, endDate: end}}}))}
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Group 1</h3>
                {userData.final.group1.subjects.map(subject => (
                  <SubjectTracker key={subject.id} subject={subject} onUpdate={(id, s, m) => updateFinalSubject('group1', id, s, m)} />
                ))}
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Group 2</h3>
                {userData.final.group2.subjects.map(subject => (
                  <SubjectTracker key={subject.id} subject={subject} onUpdate={(id, s, m) => updateFinalSubject('group2', id, s, m)} />
                ))}
              </div>
            </div>
          </section>

          {/* Exam Attempts Section (Hidden in Read Only Mode) */}
          {!isReadOnly && setUserData && (
              <section className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <ExamAttempts userData={userData} setUserData={setUserData} />
              </section>
          )}

        </div>
      </div>
    </div>
  );
};
