
import React from 'react';
import { AnalysisReport } from '../types';
import { CloseIcon, ReportIcon } from './Icons';

interface HistoryPanelProps {
  reports: AnalysisReport[];
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (report: AnalysisReport) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ reports, isOpen, onClose, onLoadReport }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
    >
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 border-l border-gray-700/50 shadow-2xl transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 id="history-panel-title" className="text-lg font-semibold text-white">Analysis History</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          {reports.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No past analyses found.</p>
              <p className="text-sm">Complete an analysis to see it here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {reports.map((report, index) => (
                <li key={report.analysisDate + index}>
                  <button 
                    onClick={() => onLoadReport(report)} 
                    className="w-full text-left p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/60 hover:border-cyan-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <div className="flex items-start">
                        <ReportIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0"/>
                        <div className="ml-4">
                            <p className="font-semibold text-white">{report.projectName}</p>
                            <p className="text-xs text-gray-400">{new Date(report.analysisDate).toLocaleString()}</p>
                        </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
