import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes';
import { AuthProvider } from './hooks/useAuth';
import { GlobalStyles } from './styles/GlobalStyles';
import './utils/i18n';

function App() {
  return (
    <AuthProvider>
      <div className="overflow-x-hidden w-full max-w-full">
        <GlobalStyles />
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;