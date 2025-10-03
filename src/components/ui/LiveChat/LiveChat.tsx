import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

interface LiveChatProps {
  messages: any[];
  onSendMessage: (message: string) => void;
  userId: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({ messages, onSendMessage, userId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {Array.isArray(messages) && messages.map((message) => (
          <div
            key={message._id}
            className={`mb-2 text-sm flex ${
              message.sender === userId ? 'justify-end' : 'justify-start'
            }`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}>
              <p>{message.message}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-100 rounded-b-lg">
        <div className="flex">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="ml-2">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
