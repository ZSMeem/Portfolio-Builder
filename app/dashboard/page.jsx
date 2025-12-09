"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import HomeTab from '../../components/dashboard/HomeTab';
import PortfoliosTab from '../../components/dashboard/PortfoliosTab';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 0 && <HomeTab />}
      {activeTab === 1 && <PortfoliosTab />}
    </DashboardLayout>
  );
}
