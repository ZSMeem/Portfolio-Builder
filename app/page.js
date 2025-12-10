'use client'

import { ArrowForward, Dashboard, Edit, Palette, Share } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return(
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar/>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          px: 2
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant='h2'
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.75rem' }
            }}
          >
            Build Your Professional Portfolio
          </Typography>
          <Typography
            variant='h5'
            sx={{
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            Create stunning portfolios with our intuitive drag-and-drop editor!
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant='contained'
              size='large'
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant='outlined'
              size='large'
              endIcon={<ArrowForward />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              View Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant='h3'
          align='center'
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}
        >
          Everything You Need
        </Typography>
        <Typography
          variant='h6'
          align='center'
          sx={{ mb: 6, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}
        >
          Powerful features to showcase your work and impress potential clients
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
              <CardContent>
                <Dashboard sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Easy Dashboard
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Manage all your portfolios from one central dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
              <CardContent>
                <Edit sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Drag & Drop Editor
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Intuitive builder with real-time preview of your changes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
              <CardContent>
                <Palette sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Custom Themes
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Choose from beautiful themes or create your own style
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
              <CardContent>
                <Share sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Easy Sharing
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Share your portfolio with a unique link in seconds
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
