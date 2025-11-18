import React, { useRef, useState } from 'react';
import { StoredFile } from '../types';
import { UploadIcon, AnalyzeIcon } from './Icons';
import { FileProcessingIndicator } from './FileProcessingIndicator';

interface FileUploadProps {
  onFilesSelected: (files: StoredFile[]) => void;
  onAnalyze: () => void;
  fileCount: number;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, onAnalyze, fileCount, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStats, setProcessingStats] = useState<{ [key: string]: number }>({});
  const [totalProcessed, setTotalProcessed] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setIsLoading(true);
    setProcessingStats({});
    setTotalProcessed(0);

    const fileList = Array.from(event.target.files);
    const filePromises: Promise<StoredFile>[] = [];
    const stats: { [key: string]: number } = {
        HTML: 0,
        CSS: 0,
        JavaScript: 0,
        JSON: 0,
        Images: 0,
        Other: 0,
    };

    for (const file of fileList) {
        // FIX: Cast file to File to prevent type errors where it's treated as 'unknown'.
        // This ensures properties like 'name' are accessible and that it can be used as a Blob.
        const currentFile = file as File;

        const extension = currentFile.name.split('.').pop()?.toLowerCase() || '';
        let category: keyof typeof stats = 'Other';
        let isTextFile = false;

        if (['html', 'htm'].includes(extension)) { category = 'HTML'; isTextFile = true; }
        else if (['css', 'scss', 'sass', 'less'].includes(extension)) { category = 'CSS'; isTextFile = true; }
        else if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(extension)) { category = 'JavaScript'; isTextFile = true; }
        else if (['json', 'md', 'txt', 'xml', 'yml'].includes(extension)) { category = 'JSON'; isTextFile = true; }
        else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif'].includes(extension)) category = 'Images';
        
        stats[category]++;
        setProcessingStats({ ...stats });
        setTotalProcessed(p => p + 1);

        if (isTextFile) {
            filePromises.push(new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    if (e.target?.result) {
                        resolve({
                            name: (currentFile as any).webkitRelativePath || currentFile.name,
                            content: e.target.result as string,
                        });
                    } else { reject(new Error(`Failed to read file: ${currentFile.name}`)); }
                };
                reader.onerror = reject;
                reader.readAsText(currentFile);
            }));
        } else {
            filePromises.push(Promise.resolve({
                name: (currentFile as any).webkitRelativePath || currentFile.name,
                content: `[Binary File: ${currentFile.name}]`,
            }));
        }
        
        if (fileList.length > 50) {
             await new Promise(r => setTimeout(r, Math.max(1, 500 / fileList.length)));
        }
    }
    
    try {
        const allFiles = await Promise.all(filePromises);
        onFilesSelected(allFiles);
    } catch (err) {
        console.error("Error reading files:", err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center flex flex-col items-center shadow-2xl min-h-[360px] justify-center">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
      />

      {isLoading ? (
        <FileProcessingIndicator stats={processingStats} totalFiles={totalProcessed} />
      ) : (
        <>
            <div className="mb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                    <UploadIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">Upload Your Project</h2>
                <p className="mt-2 text-gray-400">Select the root folder of your website source code to begin.</p>
            </div>

            <button
                onClick={handleUploadClick}
                disabled={disabled}
                className="w-full max-w-xs px-6 py-3 text-base font-semibold text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {fileCount > 0 ? `${fileCount} files selected` : 'Choose Folder'}
            </button>

            {fileCount > 0 && (
                <button
                onClick={onAnalyze}
                disabled={disabled}
                className="mt-4 w-full max-w-xs px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                <AnalyzeIcon className="w-5 h-5 mr-2" />
                Analyze Project
                </button>
            )}
        </>
      )}
    </div>
  );
};