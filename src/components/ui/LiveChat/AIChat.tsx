import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

interface AIChatProps {
  history: any[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  sendError: string | null;
  clearSendError: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ history, onSendMessage, isSending, sendError, clearSendError }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [history, sendError]);

  const handleSend = () => {
    if (input.trim() !== '' && !isSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sendError) {
      clearSendError();
    }
    setInput(e.target.value);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-grow p-4 overflow-y-auto">
        {history.length === 0 && !isSending && !sendError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiMessageSquare className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold">Welcome to the AI Assistant!</h2>
            <p>Start the conversation by typing your message below.</p>
          </div>
        ) : (
          <>
            {history.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isSending && (
                <div className="flex justify-start mb-3">
                    <div className="px-4 py-2 rounded-lg max-w-lg bg-gray-200 text-black">
                        <i>Thinking...</i>
                    </div>
                </div>
            )}
            {sendError && (
                <div className="flex justify-start mb-3">
                    <div className="px-4 py-2 rounded-lg max-w-lg bg-red-100 text-red-700">
                        <p className="font-bold">Oh no, something went wrong!</p>
                        <p>{sendError}</p>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
            onClick={handleSend}
            disabled={isSending}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};
