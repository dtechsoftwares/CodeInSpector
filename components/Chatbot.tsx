import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { CloseIcon, SpinnerIcon } from './Icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    chatSession: Chat | null;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, chatSession }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! I am the CodeInspector Bot. Ask me anything about this project.'}
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatSession || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const question = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const result = await chatSession.sendMessageStream({ message: question });
            
            let botResponseText = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of result) {
                botResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: botResponseText };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Chat API error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model' && lastMessage.text === '') {
                    newMessages[newMessages.length - 1] = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
                } else {
                    newMessages.push({ role: 'model', text: 'Sorry, I encountered an error. Please try again.' });
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 right-0 z-50 p-4 w-full max-w-lg" role="dialog" aria-modal="true">
            <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl flex flex-col h-[70vh] max-h-[600px] animate-fade-in-up">
                <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">CodeInspector Bot</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </header>
                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-prose p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <MarkdownRenderer text={msg.text} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="max-w-md p-3 rounded-xl bg-gray-700 text-gray-200 flex items-center">
                                 <SpinnerIcon className="w-5 h-5 animate-spin mr-3" />
                                 <span>Thinking...</span>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t border-gray-700/50">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about functions, components, etc."
                            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isLoading}
                            autoFocus
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="px-4 py-2 text-white bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            Send
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};