
import React from 'react';
import { Improvement } from '../../types';

interface ImprovementsTabProps {
  improvements: Improvement[];
}

const PriorityBadge: React.FC<{ priority: 'High' | 'Medium' | 'Low' }> = ({ priority }) => {
  const colorClasses = {
    High: 'bg-red-900/50 text-red-300 border-red-700/50',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
    Low: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses[priority]}`}>
      {priority}
    </span>
  );
};

export const ImprovementsTab: React.FC<ImprovementsTabProps> = ({ improvements }) => {
  const groupedImprovements = improvements.reduce((acc, imp) => {
    (acc[imp.category] = acc[imp.category] || []).push(imp);
    return acc;
  }, {} as Record<Improvement['category'], Improvement[]>);

  const categories = ['Performance', 'Security', 'SEO', 'UX', 'Code Quality', 'Scalability'] as Improvement['category'][];

  return (
    <div className="space-y-8 animate-fade-in">
      {categories.map(category => (
        groupedImprovements[category] && (
          <div key={category}>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">{category}</h3>
            <div className="space-y-4">
              {groupedImprovements[category].sort((a,b) => {
                const priorityOrder = { High: 0, Medium: 1, Low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }).map((item, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-gray-600">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-300 pr-4">{item.suggestion}</p>
                    <div className="flex-shrink-0">
                      <PriorityBadge priority={item.priority} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};
