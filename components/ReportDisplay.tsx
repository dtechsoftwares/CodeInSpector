import React, { useState, useEffect } from 'react';
import { AnalysisReport, StoredFile } from '../types';
import { generatePdf } from '../services/pdfService';
import { OverviewTab } from './tabs/OverviewTab';
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { DataFlowTab } from './tabs/DataFlowTab';
import { ImprovementsTab } from './tabs/ImprovementsTab';
import { DownloadIcon, NewAnalysisIcon, ChatIcon } from './Icons';
import { createChatWithContext } from '../services/geminiService';
import { Chat } from '@google/genai';
import { Chatbot } from './Chatbot';
import { PrintableReport } from './PrintableReport';

interface ReportDisplayProps {
  report: AnalysisReport;
  files: StoredFile[];
  onNewAnalysis: () => void;
}

type Tab = 'Overview' | 'Architecture' | 'Data Flow' | 'Improvements';

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, files, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      try {
        const session = createChatWithContext(files);
        setChatSession(session);
      } catch (error) {
        console.error("Failed to create chat session:", error);
      }
    }
  }, [files]);

  useEffect(() => {
    if (isPreparingPdf) {
      // Allow React to render the hidden PrintableReport component
      setTimeout(async () => {
        try {
          await generatePdf(report, 'printable-content');
        } catch(e) {
          console.error("PDF generation failed", e);
          alert("Sorry, there was an error generating the PDF.");
        } finally {
          setIsDownloading(false);
          setIsPreparingPdf(false); // Cleanup
        }
      }, 100);
    }
  }, [isPreparingPdf, report]);


  const handleDownload = () => {
    setIsDownloading(true);
    setIsPreparingPdf(true); // This will trigger the useEffect
  };
  
  const TABS: Tab[] = ['Overview', 'Architecture', 'Data Flow', 'Improvements'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab overview={report.overview} />;
      case 'Architecture':
        return <ArchitectureTab architecture={report.architecture} />;
      case 'Data Flow':
        return <DataFlowTab dataFlow={report.dataFlow} />;
      case 'Improvements':
        return <ImprovementsTab improvements={report.improvements} />;
      default:
        return null;
    }
  };

  return (
    <>
    <div className="bg-gray-800/30 rounded-xl shadow-2xl animate-fade-in">
      <div className="p-6 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{report.projectName}</h2>
          <p className="text-sm text-gray-400">Analysis complete: {new Date(report.analysisDate).toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button 
            onClick={() => setIsChatOpen(true)} 
            disabled={!chatSession}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ask AI about this project"
          >
              <ChatIcon className="w-4 h-4 mr-2" />
              Chat with AI
          </button>
          <button onClick={onNewAnalysis} className="px-4 py-2 text-sm font-medium text-cyan-300 bg-cyan-900/50 border border-cyan-800/80 rounded-md hover:bg-cyan-800/50 transition-colors flex items-center">
            <NewAnalysisIcon className="w-4 h-4 mr-2" />
            New Analysis
          </button>
          <button onClick={handleDownload} disabled={isDownloading} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md hover:from-cyan-600 hover:to-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-wait">
            <DownloadIcon className="w-4 h-4 mr-2"/>
            {isDownloading ? 'Preparing PDF...' : 'Download Report'}
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-700/50">
        <nav className="-mb-px flex space-x-4 px-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div id="report-content" className="p-6">
        {renderTabContent()}
      </div>
    </div>
    
    {isPreparingPdf && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '1024px' }}>
            <PrintableReport report={report} />
        </div>
    )}

    <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        chatSession={chatSession}
    />
    </>
  );
};