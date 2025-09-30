import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Discovery from './pages/Discovery';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/channels/@me" />} />
                          <Route path="/channels/:serverId/:channelId?" element={<Chat />} />
                          <Route path="/discover" element={<Discovery />} />
                          <Route path="/profile/:userId?" element={<Profile />} />
                          <Route path="/settings/*" element={<Settings />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;