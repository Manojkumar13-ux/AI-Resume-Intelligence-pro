import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Dashboard } from '../components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;