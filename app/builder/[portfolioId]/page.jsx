"use client";

import { useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EditorWithBackend from '../../../components/EditorWithBackend';
import { CircularProgress, Box } from '@mui/material';

export default function BuilderPage() {
  const { portfolioId } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <EditorWithBackend portfolioId={portfolioId} />;
}
