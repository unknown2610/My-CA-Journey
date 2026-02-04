import React from 'react';
import { UserData, Status, CourseLevel, EntryRoute } from '../types';
import { CheckCircle, Circle, MapPin, Flag, ChevronDown } from 'lucide-react';

interface TimelineProps {
  userData: UserData;
}

export const Timeline: React.FC<TimelineProps> = ({ userData }) => {
  
  // Helper to determine milestone status
  const isFoundationDone = userData.entryRoute === EntryRoute.DirectEntry || userData.foundation.status === Status.Completed;
  
  const isInterG1Done = userData.intermediate.group1.status === Status.Completed || userData.intermediate.group1.status === Status.Exempted;
  const isInterG2Done = userData.intermediate.group2.status === Status.Completed || userData.intermediate.group2.status === Status.Exempted;
  const isInterDone = isInterG1Done && isInterG2Done;
  
  const isIcitssDone = userData.intermediate.icitss.status === Status.Completed;
  
  const isArticleshipStarted = userData.articleship.startDate !== undefined && userData.articleship.startDate !== '';
  const isArticleshipDone = userData.articleship.status === Status.Completed;
  
  const isSpomDone = userData.selfPacedModules.setA.status === Status.Completed && userData.selfPacedModules.setB.status === Status.Completed;
  
  const isFinalG1Done = userData.final.group1.status === Status.Completed || userData.final.group1.status === Status.Exempted;
  const isFinalG2Done = userData.final.group2.status === Status.Completed || userData.final.group2.status === Status.Exempted;
  const isFinalDone = isFinalG1Done && isFinalG2Done;
  
  const isAdvIcitssDone = userData.final.advIcitss.status === Status.Completed;

  // Determine current active stage logic
  // We process the list to find the *first* item that is NOT completed/exempted
  
  const milestones = [
    {
      id: 'reg',
      title: '📝 Registration',
      date: userData.registrationDate,
      status: Status.Completed,
      description: `Registered via ${userData.entryRoute}`
    },
    ...(userData.entryRoute === EntryRoute.Foundation ? [{
      id: 'found',
      title: '📚 Foundation Exam',
      status: userData.foundation.status,
      description: 'Pass Class XII + 4 Months Study',
      isRequired: true
    }] : []),
    {
      id: 'inter_study',
      title: '📖 Intermediate Course',
      status: isInterDone ? Status.Completed : (isFoundationDone ? Status.InProgress : Status.Pending),
      description: 'Group 1 & Group 2',
      isRequired: true
    },
    {
      id: 'icitss',
      title: '💻 ICITSS Training',
      status: userData.intermediate.icitss.status,
      description: 'IT + OC (4 Weeks)',
      isRequired: true
    },
    {
      id: 'articleship',
      title: '💼 Practical Training',
      status: userData.articleship.status,
      description: '2 Years Mandatory Articleship',
      isActiveOverride: isArticleshipStarted && !isArticleshipDone,
      isRequired: true
    },
    {
      id: 'spom',
      title: '🌐 SPOM (Set A & B)',
      status: isSpomDone ? Status.Completed : Status.Pending,
      description: 'Self-Paced Online Modules',
      isRequired: true
    },
    {
      id: 'adv_icitss',
      title: '🧠 Advanced ICITSS',
      status: userData.final.advIcitss.status,
      description: 'Adv IT + MCS - Before Final Exam',
      isRequired: true
    },
    {
      id: 'final',
      title: '🎓 Final Exam',
      status: isFinalDone ? Status.Completed : (isArticleshipDone && isAdvIcitssDone && isSpomDone ? Status.InProgress : Status.Pending),
      description: 'Pass Both Groups',
      isRequired: true
    },
    {
      id: 'convocation',
      title: '🏆 Convocation',
      status: isFinalDone ? Status.Pending : Status.Pending, // Actually completed only after Final
      description: 'Membership & ACA Title',
      isLast: true,
      isRequired: true
    }
  ];

  // Post-process to find the exact "Current Stage"
  let foundCurrent = false;
  const processedMilestones = milestones.map((m, idx) => {
      const isCompleted = m.status === Status.Completed || m.status === Status.Exempted;
      
      // Override for Articleship which can be concurrent
      if (m.isActiveOverride) {
          foundCurrent = true;
          return { ...m, isCurrent: true };
      }

      // If this is the first non-completed item, it's the current stage
      if (!isCompleted && !foundCurrent) {
          foundCurrent = true;
          return { ...m, isCurrent: true, status: Status.InProgress };
      }
      
      // Special case: Convocation
      if (m.isLast && isFinalDone) {
          return { ...m, isCurrent: true, status: Status.Completed }; // You made it!
      }

      return { ...m, isCurrent: false };
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" /> Your Journey
      </h3>
      
      {/* 
         Structure:
         Container has pl-4 (16px).
         Dot is w-10 (40px). 
         Center of dot = 16px (padding) + 20px (half-width) = 36px.
         Vertical Line needs to be centered at 36px. 
         Line width is w-0.5 (2px).
         Left position = 36px - 1px = 35px.
      */}
      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[35px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

        <div className="space-y-8">
          {processedMilestones.map((milestone, index) => {
            const isCompleted = milestone.status === Status.Completed || milestone.status === Status.Exempted;
            const isCurrent = milestone.isCurrent;
            
            return (
              <div key={milestone.id} className={`relative flex items-start gap-4 ${isCurrent ? 'scale-105 transition-transform origin-left' : ''}`}>
                
                {/* Dot Indicator */}
                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 flex-shrink-0 bg-white dark:bg-slate-800 transition-colors duration-300
                  ${isCompleted ? 'border-green-500 text-green-500' : 
                    isCurrent ? 'border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)] dark:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 
                    'border-slate-300 text-slate-300 dark:border-slate-600'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                   milestone.isLast ? <Flag className="w-4 h-4" /> :
                   <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />}
                </div>

                {/* Content */}
                <div className={`${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-60'} pt-2`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className={`text-sm font-bold leading-none ${isCompleted ? 'text-green-700 dark:text-green-400' : isCurrent ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {milestone.title}
                    </h4>
                    {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                            You are here
                        </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {milestone.description}
                  </p>
                  
                  {milestone.date && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 mt-1.5 inline-block">
                      {milestone.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
