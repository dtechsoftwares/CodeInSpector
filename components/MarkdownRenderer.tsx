import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  const parts = text.split(/(```(?:\w+)?\n[\s\S]*?\n```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const codeBlock = part.replace(/```(?:\w+)?\n/,'').replace(/\n```/,'');
          return (
            <pre key={index} className="bg-gray-900 text-gray-300 p-3 my-1 rounded-md overflow-x-auto text-sm font-mono">
              <code>{codeBlock}</code>
            </pre>
          );
        }
        return (
          <span key={index} className="whitespace-pre-wrap leading-relaxed">
            {part}
          </span>
        );
      })}
    </>
  );
};
