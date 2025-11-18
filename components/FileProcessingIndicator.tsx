import React from 'react';
import { CodeFileIcon } from './Icons';

interface FileProcessingIndicatorProps {
    stats: { [key: string]: number };
    totalFiles: number;
}

export const FileProcessingIndicator: React.FC<FileProcessingIndicatorProps> = ({ stats, totalFiles }) => {
    const categories = ['HTML', 'CSS', 'JavaScript', 'JSON', 'Images', 'Other'];

    return (
        <div className="w-full max-w-md font-mono text-cyan-300">
            <div className="flex flex-col items-center text-center">
                 <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 border border-cyan-500/30">
                        <CodeFileIcon className="h-8 w-8 text-cyan-400" />
                    </div>
                </div>
                <h2 className="mt-6 text-xl font-bold tracking-widest animate-text-glow">SCANNING PROJECT FILES</h2>
                <p className="mt-2 text-sm text-gray-400">Please wait while we analyze your project structure...</p>
            </div>
            
            <div className="mt-6 border-t border-b border-cyan-800/50 py-4 px-2">
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    {categories.map(cat => (
                        stats[cat] > 0 && (
                            <div key={cat} className="flex justify-between items-baseline">
                                <span className="text-gray-400">{cat}:</span>
                                <span className="text-white font-semibold tracking-wider tabular-nums">{stats[cat]}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
             <div className="mt-4 text-center">
                 <p className="text-sm text-gray-400">Total Files Found: <span className="text-white font-bold text-lg tabular-nums">{totalFiles}</span></p>
            </div>
            <div className="mt-6 w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-1.5 rounded-full animate-progress-indeterminate"></div>
            </div>
        </div>
    );
};
