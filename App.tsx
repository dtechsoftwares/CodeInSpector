
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisInProgress } from './components/AnalysisInProgress';
import { ReportDisplay } from './components/ReportDisplay';
import { AnalysisReport, StoredFile } from './types';
import { analyzeCode } from './services/geminiService';
import { HistoryPanel } from './components/HistoryPanel';

type AnalysisState = 'idle' | 'analyzing' | 'error' | 'complete';

export default function App() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisReport[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('analysisHistory');
    }
  }, []);

  const handleFilesSelected = (selectedFiles: StoredFile[]) => {
    setFiles(selectedFiles);
    setReport(null);
    setAnalysisState('idle');
  };

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) {
      setError('Please upload a project folder first.');
      setAnalysisState('error');
      return;
    }
    setAnalysisState('analyzing');
    setError(null);
    setReport(null);

    try {
      const analysisResult = await analyzeCode(files);
      const newReport = { ...analysisResult, projectName: files[0]?.name.split('/')[0] || 'Untitled Project', analysisDate: new Date().toISOString() };
      setReport(newReport);
      setAnalysisState('complete');
      const updatedHistory = [newReport, ...history].slice(0, 10); // Keep last 10 reports
      setHistory(updatedHistory);
      localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. The AI model may be overloaded. Please try again.');
      setAnalysisState('error');
    }
  }, [files, history]);

  const handleReset = () => {
    setFiles([]);
    setReport(null);
    setAnalysisState('idle');
    setError(null);
  };
  
  const loadReportFromHistory = (reportToLoad: AnalysisReport) => {
    setReport(reportToLoad);
    setAnalysisState('complete');
    setFiles([]); // Clear files when loading from history to avoid confusion
    setHistoryVisible(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col">
      <Header onHistoryClick={() => setHistoryVisible(!historyVisible)} />
       <HistoryPanel 
        reports={history} 
        isOpen={historyVisible} 
        onClose={() => setHistoryVisible(false)}
        onLoadReport={loadReportFromHistory}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {analysisState !== 'analyzing' && !report && (
            <FileUpload 
              onFilesSelected={handleFilesSelected} 
              onAnalyze={handleAnalyze} 
              fileCount={files.length}
              disabled={analysisState === 'analyzing'}
            />
          )}

          {analysisState === 'analyzing' && <AnalysisInProgress />}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 text-center">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {report && analysisState === 'complete' && (
            <ReportDisplay report={report} files={files} onNewAnalysis={handleReset} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>DTech Softwares - "We Came to Change The Game."</p>
      </footer>
    </div>
  );
}