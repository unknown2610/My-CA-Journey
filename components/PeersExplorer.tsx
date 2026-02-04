import React, { useState } from 'react';
import { MOCK_PEERS } from '../constants';
import { PeerProfile, UserData } from '../types';
import { Dashboard } from './Dashboard';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export const PeersExplorer: React.FC = () => {
  const [selectedPeer, setSelectedPeer] = useState<PeerProfile | null>(null);

  // Cast PeerProfile to UserData for the dashboard, adding an empty attempts array
  const peerToUserData = (peer: PeerProfile): UserData => {
    return {
        ...peer,
        attempts: []
    } as UserData;
  };

  if (selectedPeer) {
    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setSelectedPeer(null)}
          className="mb-4 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Peers List
        </button>
        <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
                Viewing <strong>{selectedPeer.name}'s</strong> progress. Exam attempts are private and hidden.
            </p>
        </div>
        <Dashboard userData={peerToUserData(selectedPeer)} isReadOnly={true} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PEERS.map(peer => (
        <div 
            key={peer.id}
            onClick={() => setSelectedPeer(peer)}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {peer.name.charAt(0)}
                </div>
                <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 font-medium">
                    {peer.progressPercentage}% Complete
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{peer.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{peer.state}</p>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Current Level</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{peer.currentLevel}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Route</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{peer.entryRoute === 'Direct Entry Route' ? 'Direct Entry' : 'Foundation'}</span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end text-blue-600 text-sm font-medium">
                View Progress <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </div>
      ))}
    </div>
  );
};
