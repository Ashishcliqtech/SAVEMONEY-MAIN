import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAIChatHistory, sendAIMessage } from '../../../api/aiChat';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner, ErrorState } from '..';
import { AIChat } from './AIChat';
import { FiMessageSquare, FiX, FiCpu } from 'react-icons/fi';

export const ChatPopup: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user || !isOpen) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAIChatHistory();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setError('Could not load your chat history. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchHistory();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, fetchHistory]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  const handleSendMessage = async (content: string) => {
    if (isSending) return;
    setIsSending(true);
    setSendError(null);

    const userMessage = { role: 'user', parts: [{ text: content }] };
    setHistory(prev => [...prev, userMessage]);

    try {
      const { data } = await sendAIMessage(content);
      setHistory(prev => [...prev, data.response]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setSendError('Failed to get a response from the AI. Please try again.');
      setHistory(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const clearSendError = () => setSendError(null);
  const toggleChat = () => setIsOpen(!isOpen);

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-5 right-5 z-[100]">
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-110"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <FiX size={28} /> : <FiMessageSquare size={28} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window fixed inset-0 z-50 flex flex-col bg-white md:bottom-24 md:right-5 md:inset-auto md:w-[400px] md:h-[calc(100vh-150px)] max-h-[700px] md:rounded-2xl md:shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md md:rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCpu className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Assistant</h2>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:opacity-80 md:hidden p-1 rounded-full hover:bg-white/10"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={chatRef} className="flex-grow overflow-y-auto px-3 py-2 bg-gray-50">
            {loading ? (
              <LoadingSpinner text="Loading conversation..." />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchHistory} />
            ) : (
              <AIChat
                history={history}
                onSendMessage={handleSendMessage}
                isSending={isSending}
                sendError={sendError}
                clearSendError={clearSendError}
              />
            )}
          </div>
        </div>
      )}

      <style>
        {`
          .chat-window {
            animation: slide-in 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          }
          @keyframes slide-in {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @media (min-width: 768px) {
            .chat-window {
              animation: fade-up 0.3s ease-out;
            }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};
