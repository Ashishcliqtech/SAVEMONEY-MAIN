import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

interface AIChatProps {
  history: any[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  sendError: string | null;
  clearSendError: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  history,
  onSendMessage,
  isSending,
  sendError,
  clearSendError,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, sendError]);

  const handleSend = () => {
    if (input.trim() !== '' && !isSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sendError) clearSendError();
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {history.length === 0 && !isSending && !sendError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
            <FiMessageSquare className="w-16 h-16 mb-4 opacity-60" />
            <h2 className="text-lg font-semibold">Welcome to AI Assistant!</h2>
            <p className="text-sm">Start by typing a message below.</p>
          </div>
        ) : (
          <>
            {history.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow-sm animate-fadeIn
                  ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border rounded-bl-none'
                  }`}
                >
                  {msg.parts[0].text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-white border text-gray-500 italic animate-pulse">
                  Thinking...
                </div>
              </div>
            )}

            {sendError && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 px-4 py-2 rounded-2xl max-w-[90%] bg-red-100 text-red-700 border border-red-300 text-sm">
                  <FiAlertCircle className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Something went wrong</p>
                    <p>{sendError}</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Box */}
      <div className="sticky bottom-0 bg-white border-t px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-grow px-3 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center transition"
            aria-label="Send"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};
