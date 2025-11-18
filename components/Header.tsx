
import React from 'react';
import { LogoIcon, HistoryIcon } from './Icons';

interface HeaderProps {
    onHistoryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white tracking-tight">CodeInspector Hub</h1>
              <p className="text-xs text-gray-400">by DTech Softwares</p>
            </div>
          </div>
          <div className="flex items-center">
             <button
                onClick={onHistoryClick}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                aria-label="View analysis history"
             >
                <HistoryIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
