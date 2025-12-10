"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { portfolioAPI } from '../../lib/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function PortfolioDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('');
  
  // Snackbar for copy feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setError('');
      const response = await portfolioAPI.getAll();
      setPortfolios(response.portfolios);
    } catch (err) {
      setError('Failed to load portfolios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolioTitle.trim()) return;

    setCreating(true);
    try {
      const response = await portfolioAPI.create(
        newPortfolioTitle,
        newPortfolioDescription
      );
      
      setPortfolios([response.portfolio, ...portfolios]);
      setCreateDialogOpen(false);
      setNewPortfolioTitle('');
      setNewPortfolioDescription('');
      
      router.push(`/builder/${response.portfolio.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await portfolioAPI.togglePublish(id, !currentStatus);
      
      setPortfolios(portfolios.map(p => 
        p.id === id ? { ...p, isPublished: !currentStatus } : p
      ));
    } catch (err) {
      setError('Failed to update portfolio');
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      await portfolioAPI.delete(id);
      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete portfolio');
    }
  };

  const handleEditPortfolio = (id) => {
    router.push(`/builder/${id}`);
  };

  const handleCopyUrl = (slug) => {
    const url = `${origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarMessage('Link copied to clipboard!');
      setSnackbarOpen(true);
    }).catch(() => {
      setSnackbarMessage('Failed to copy link');
      setSnackbarOpen(true);
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Portfolios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.name}!
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Portfolio
          </Button>
          <Button variant="outlined" onClick={() => router.push('/settings')}>
            Settings
          </Button>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Portfolios Grid */}
      {portfolios.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No portfolios yet
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create your first portfolio to get started!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 2 }}
          >
            Create Portfolio
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {portfolio.title}
                    </Typography>
                    <Chip
                      label={portfolio.isPublished ? 'Published' : 'Draft'}
                      color={portfolio.isPublished ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {portfolio.description || 'No description'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`${portfolio._count?.projects || 0} projects`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${portfolio._count?.sections || 0} sections`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleEditPortfolio(portfolio.id)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => router.push(`/preview/${portfolio.id}`)}
                      color="secondary"
                    >
                      Preview
                    </Button>
                    
                    {portfolio.isPublished && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => router.push(`/portfolio/${portfolio.slug}`)}
                        color="success"
                      >
                        View
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleTogglePublish(portfolio.id, portfolio.isPublished)}
                      title={portfolio.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {portfolio.isPublished ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>

                {/* Show public URL if published */}
                {portfolio.isPublished && origin && (
                  <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: '#f5f5f5', borderRadius: 1, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Public URL:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          wordBreak: 'break-all',
                          flexGrow: 1,
                        }}
                      >
                        {origin}/portfolio/{portfolio.slug}
                      </Typography>
                      <Tooltip title="Copy link">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyUrl(portfolio.slug)}
                          sx={{ 
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'primary.light' }
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Portfolio Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
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

      {/* Copy Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
