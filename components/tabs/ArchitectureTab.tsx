
import React from 'react';
import { Architecture } from '../../types';

interface ArchitectureTabProps {
  architecture: Architecture;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">{title}</h3>
        <div className="bg-gray-900/50 p-4 rounded-md">
            {children}
        </div>
    </div>
);

const List: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="space-y-2">
        {items.length > 0 ? items.map((item, index) => (
            <li key={index} className="text-gray-300 font-mono text-sm bg-gray-800/60 p-2 rounded-md">{item}</li>
        )) : <li className="text-gray-500 italic">None detected.</li>}
    </ul>
);

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ architecture }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Section title="Structure Summary">
        <p className="text-gray-300 leading-relaxed">{architecture.structureSummary}</p>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Main Pages">
          <List items={architecture.pages} />
        </Section>
        <Section title="Reusable Components">
          <List items={architecture.reusableComponents} />
        </Section>
        <Section title="Asset Folders">
          <List items={architecture.assetFolders} />
        </Section>
        <Section title="External Libraries & CDNs">
          <ul className="space-y-2">
            {architecture.externalLibraries.length > 0 ? architecture.externalLibraries.map((lib, index) => (
              <li key={index} className="text-gray-300 font-mono text-sm bg-gray-800/60 p-2 rounded-md">
                <span className="font-bold text-white">{lib.name}</span>
                <br />
                <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs break-all hover:underline">{lib.url}</a>
              </li>
            )) : <li className="text-gray-500 italic">None detected.</li>}
          </ul>
        </Section>
      </div>
    </div>
  );
};
