
import React from 'react';

export const AnalysisInProgress: React.FC = () => {
  const messages = [
    "Initializing AI code analysis...",
    "Parsing file structures and dependencies...",
    "Detecting frameworks and libraries...",
    "Mapping data flows and API endpoints...",
    "Scanning for performance bottlenecks...",
    "Formulating improvement suggestions...",
    "Compiling your comprehensive report...",
  ];

  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center flex flex-col items-center shadow-2xl animate-pulse">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-75 animate-ping"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
          <svg className="h-8 w-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">Analysis in Progress</h2>
      <p className="mt-2 text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};
