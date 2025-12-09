"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { portfolioAPI } from '../../lib/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePortfolio = async () => {
    if (!newPortfolioTitle.trim()) return;

    setCreating(true);
    setError('');
    try {
      const response = await portfolioAPI.create(
        newPortfolioTitle,
        newPortfolioDescription
      );

      setCreateDialogOpen(false);
      setNewPortfolioTitle('');
      setNewPortfolioDescription('');

      router.push(`/builder/${response.portfolio.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create portfolio');
    } finally {
      setCreating(false);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: 6,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <RocketLaunchIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {getCurrentGreeting()}, {user?.name}!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Welcome back to your portfolio builder
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          Create New Portfolio
        </Button>
      </Paper>

      {/* Quick Stats/Info Cards */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            🎨
          </Typography>
          <Typography variant="h6" gutterBottom>
            Templates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose from previous portfolio designs by YOU
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            ⚡
          </Typography>
          <Typography variant="h6" gutterBottom>
            Easy to Use
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize it with our intuitive editor
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            🚀
          </Typography>
          <Typography variant="h6" gutterBottom>
            Publish Instantly
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your portfolio with a single click
          </Typography>
        </Paper>
      </Box>

      {/* Getting Started Section */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Getting Started
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>
              <strong>Create a portfolio</strong> - Click the button above to start
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>
              <strong>Add sections</strong> - Build your portfolio with customizable sections
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>
              <strong>Add projects</strong> - Showcase your best work
            </Typography>
          </Box>
          <Box component="li">
            <Typography>
              <strong>Publish and share</strong> - Make your portfolio live with one click
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Create Portfolio Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Portfolio Title"
            value={newPortfolioTitle}
            onChange={(e) => setNewPortfolioTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description (optional)"
            value={newPortfolioDescription}
            onChange={(e) => setNewPortfolioDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreatePortfolio}
            variant="contained"
            disabled={creating || !newPortfolioTitle.trim()}
          >
            {creating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
