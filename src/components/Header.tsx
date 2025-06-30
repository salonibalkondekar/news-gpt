'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="surface border-b mb-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                GPT-News
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium text-accent-primary bg-blue-50 rounded-full">
                Live
              </span>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="button-secondary p-2 focus-ring"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
