import React, { useState, useEffect } from 'react';
import { INITIAL_USER_DATA, INDIAN_STATES } from './constants';
import { UserData, EntryRoute, CourseLevel, Status } from './types';
import { Dashboard } from './components/Dashboard';
import { Settings, Moon, Sun, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [tempUser, setTempUser] = useState<Partial<UserData>>({ ...INITIAL_USER_DATA });

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ca-tracker-data');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
    const theme = localStorage.getItem('ca-theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save state
  useEffect(() => {
    if (userData) {
      localStorage.setItem('ca-tracker-data', JSON.stringify(userData));
    }
  }, [userData]);

  // Toggle Theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ca-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ca-theme', 'light');
    }
  };

  const finalizeOnboarding = (level: string) => {
    let finalData = { ...INITIAL_USER_DATA, ...tempUser };

    // Auto-complete logic based on current level selected during onboarding
    if (level === 'inter_studying' || level === 'final_studying') {
      // Mark Foundation as Completed
      finalData.foundation.status = Status.Completed;
      finalData.foundation.papers = finalData.foundation.papers.map(p => ({ ...p, status: Status.Completed, marks: 60 })); // Mock marks for auto-complete
    }

    if (level === 'final_studying') {
      // Mark Inter as Completed
      finalData.intermediate.group1.status = Status.Completed;
      finalData.intermediate.group1.subjects = finalData.intermediate.group1.subjects.map(s => ({ ...s, status: Status.Completed, marks: 60 }));
      finalData.intermediate.group2.status = Status.Completed;
      finalData.intermediate.group2.subjects = finalData.intermediate.group2.subjects.map(s => ({ ...s, status: Status.Completed, marks: 60 }));
      finalData.intermediate.icitss.status = Status.Completed;
      finalData.currentLevel = CourseLevel.Final;
    } else if (level === 'inter_studying') {
      finalData.currentLevel = CourseLevel.Intermediate;
    } else {
      finalData.currentLevel = CourseLevel.Foundation;
    }

    // Direct Entry Override
    if (finalData.entryRoute === EntryRoute.DirectEntry) {
      finalData.foundation.status = Status.Exempted;
      finalData.foundation.papers = finalData.foundation.papers.map(p => ({ ...p, status: Status.Exempted }));
    }

    setUserData(finalData as UserData);
  };

  // Onboarding Screen
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="bg-icai-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
              🇮🇳
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My CA Journey</h1>
            <p className="text-slate-500 mt-2">Setup your profile</p>
          </div>

          <div className="space-y-6">
            {onboardingStep === 1 && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    value={tempUser.name || ''}
                    onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                    type="text"
                    className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <select
                    value={tempUser.state || ''}
                    onChange={(e) => setTempUser({ ...tempUser, state: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <button
                  disabled={!tempUser.name || !tempUser.state}
                  onClick={() => setOnboardingStep(2)}
                  className="w-full bg-icai-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Entry Route</label>
                  <select
                    value={tempUser.entryRoute}
                    onChange={(e) => setTempUser({ ...tempUser, entryRoute: e.target.value as EntryRoute })}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={EntryRoute.Foundation}>Foundation Route (After Class XII)</option>
                    <option value={EntryRoute.DirectEntry}>Direct Entry Route (Graduates/Inter Pass)</option>
                  </select>
                </div>
                <button
                  onClick={() => setOnboardingStep(3)}
                  className="w-full bg-icai-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Next Step
                </button>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="animate-fade-in space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  What is your current academic status?
                </label>

                <button
                  onClick={() => finalizeOnboarding('found_studying')}
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
                >
                  <span className="block font-semibold text-slate-800 dark:text-white group-hover:text-blue-700">Studying for Foundation</span>
                  <span className="text-xs text-slate-500">I have registered but not passed Foundation yet.</span>
                </button>

                <button
                  onClick={() => finalizeOnboarding('inter_studying')}
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
                >
                  <span className="block font-semibold text-slate-800 dark:text-white group-hover:text-blue-700">Studying for Intermediate</span>
                  <span className="text-xs text-slate-500">I have passed Foundation (or Direct Entry) and am preparing for Inter.</span>
                </button>

                <button
                  onClick={() => finalizeOnboarding('final_studying')}
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
                >
                  <span className="block font-semibold text-slate-800 dark:text-white group-hover:text-blue-700">Studying for Final</span>
                  <span className="text-xs text-slate-500">I have passed both groups of Intermediate and am in Final/Articleship.</span>
                </button>

                <button onClick={() => setOnboardingStep(2)} className="w-full text-center text-sm text-slate-400 mt-4">Back</button>
              </div>
            )}

            <div className="flex gap-2 justify-center mt-6">
              {[1, 2, 3].map(step => (
                <div key={step} className={`w-2 h-2 rounded-full ${step === onboardingStep ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-icai-blue text-white p-1.5 rounded font-bold text-xs">CA</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:inline">My CA Journey</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">ICAI Prospectus Aligned</span>
              <span className="sm:hidden">Prospectus</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all progress data?')) {
                  localStorage.removeItem('ca-tracker-data');
                  setUserData(null);
                  setOnboardingStep(1);
                  setTempUser({ ...INITIAL_USER_DATA });
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Reset Data"
            >
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </nav>

      <Dashboard userData={userData} setUserData={setUserData} />

      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>Designed based on ICAI Prospectus 2024</p>
        <p className="text-xs mt-1">This is a personal tracker and not an official ICAI website.</p>
      </footer>
    </div>
  );
};

export default App;
