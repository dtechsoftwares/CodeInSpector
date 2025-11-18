
import React from 'react';
import { DataFlow } from '../../types';

interface DataFlowTabProps {
  dataFlow: DataFlow;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">{title}</h3>
        <div className="bg-gray-900/50 p-4 rounded-md">
            {children}
        </div>
    </div>
);


export const DataFlowTab: React.FC<DataFlowTabProps> = ({ dataFlow }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Section title="Data Handling Summary">
        <p className="text-gray-300 leading-relaxed">{dataFlow.dataSummary}</p>
      </Section>
      
      <Section title="Detected Forms">
        {dataFlow.forms.length > 0 ? (
          <div className="space-y-4">
            {dataFlow.forms.map((form, index) => (
              <div key={index} className="bg-gray-800/60 p-4 rounded-lg">
                <p className="font-semibold text-white">Form ID: <span className="font-mono text-cyan-300">{form.id}</span></p>
                <p className="text-sm text-gray-400">Action: <span className="font-mono">{form.action}</span></p>
                <p className="text-sm text-gray-400">Method: <span className="font-mono">{form.method}</span></p>
                <p className="text-sm text-gray-400 mt-2">Fields:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.fields.map((field, fIndex) => (
                    <span key={fIndex} className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{field}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 italic">No forms detected.</p>}
      </Section>

      <Section title="API Calls (fetch/xhr)">
        {dataFlow.apiCalls.length > 0 ? (
          <div className="space-y-4">
            {dataFlow.apiCalls.map((apiCall, index) => (
              <div key={index} className="bg-gray-800/60 p-4 rounded-lg">
                <p className="font-semibold text-white break-all">URL: <span className="font-mono text-cyan-300">{apiCall.url}</span></p>
                <p className="text-sm text-gray-400">Method: <span className="font-mono">{apiCall.method}</span></p>
                <p className="text-sm text-gray-400">Purpose: {apiCall.purpose}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 italic">No API calls detected.</p>}
      </Section>

      <Section title="Potential Security Issues">
        <ul className="list-disc list-inside space-y-2">
            {dataFlow.securityIssues.length > 0 ? dataFlow.securityIssues.map((issue, index) => (
              <li key={index} className="text-red-400">
                <span className="text-gray-300">{issue}</span>
              </li>
            )) : <li className="text-gray-500 italic list-none">No immediate security issues detected.</li>}
        </ul>
      </Section>
    </div>
  );
};
