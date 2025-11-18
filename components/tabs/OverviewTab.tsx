import React from 'react';
import { Overview } from '../../types';

interface OverviewTabProps {
  overview: Overview;
}

const CategoryIcon = ({ category }: { category: string }) => {
    let icon;
    switch (category.toLowerCase()) {
        case 'javascript library':
        case 'javascript framework':
            icon = 'JS'; break;
        case 'css framework':
            icon = 'CSS'; break;
        case 'backend language':
            icon = 'PHP'; break;
        default:
            icon = 'DEV'; break;
    }
    return (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-cyan-300 mr-4 flex-shrink-0">
            {icon}
        </div>
    );
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ overview }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Website Type</h3>
          <p className="text-gray-300 bg-gray-900/50 p-4 rounded-md h-full">{overview.websiteType}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Detected Theme</h3>
          <p className="text-gray-300 bg-gray-900/50 p-4 rounded-md h-full">{overview.theme}</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">AI Summary</h3>
        <p className="text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-md">{overview.summary}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">Detected Technologies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.technologies.map((tech, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-md flex items-center">
              <CategoryIcon category={tech.category} />
              <div>
                <p className="font-semibold text-white">{tech.name}</p>
                <p className="text-sm text-gray-400">{tech.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};