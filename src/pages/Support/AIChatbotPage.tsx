
import React, { useState, useEffect, useCallback } from 'react';
import { getAIChatHistory, sendAIMessage } from '../../api/aiChat';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner, ErrorState } from '../../components/ui';
import { AIChat } from '../../components/ui/LiveChat/AIChat';

export const AIChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
      setSendError('Failed to get a response from the AI. Please check your connection or try again.');
      // Revert optimistic update on error
      setHistory(prev => prev.slice(0, prev.length - 1));
    } finally {
      setIsSending(false);
    }
  };

  const clearSendError = () => {
    setSendError(null);
  }

  if (loading) return <LoadingSpinner text="Loading conversation..." />;
  if (error) return <ErrorState message={error} onRetry={fetchHistory} />;

  return (
    <div className="p-4" style={{height: 'calc(100vh - 80px)'}}>
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <AIChat
        history={history}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        sendError={sendError}
        clearSendError={clearSendError}
      />
    </div>
  );
};
