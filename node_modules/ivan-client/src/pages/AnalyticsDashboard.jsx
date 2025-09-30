import React from 'react';
import Layout from '../components/Layout/Layout';
import Analytics from '../components/Admin/Analytics';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Analytics />
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;