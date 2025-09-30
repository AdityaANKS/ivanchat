import React from 'react';
import Layout from '../components/Layout/Layout';
import DiscoveryFeed from '../components/Discovery/DiscoveryFeed';

const Discovery = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <DiscoveryFeed />
        </div>
      </div>
    </Layout>
  );
};

export default Discovery;