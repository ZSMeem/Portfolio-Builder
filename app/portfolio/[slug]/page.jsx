"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Link as MuiLink,
} from '@mui/material';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    try {
      const response = await fetch(`/api/public/portfolio/${slug}`);
      
      if (!response.ok) {
        throw new Error('Portfolio not found');
      }
      
      const data = await response.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !portfolio) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Portfolio Not Found
        </Typography>
        <Typography color="text.secondary">
          The portfolio you're looking for doesn't exist or is not published.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={0} sx={{ p: 6, mb: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar
            src={portfolio.user?.profilePicture || undefined}
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {!portfolio.user?.profilePicture && portfolio.user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {portfolio.title}
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {portfolio.user?.name}
          </Typography>
          
          {portfolio.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
              {portfolio.description}
            </Typography>
          )}
        </Paper>

        {/* Sections */}
        {portfolio.sections && portfolio.sections.map((section) => (
          <Paper
            key={section.id}
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            {section.title && (
              <Typography variant="h5" gutterBottom fontWeight="600" color="primary.main">
                {section.title}
              </Typography>
            )}
            
            {section.content && (
              <Box
                sx={{
                  mt: 2,
                  '& p': { marginBottom: 2, lineHeight: 1.7 },
                  '& h1, & h2, & h3': { marginTop: 3, marginBottom: 2 },
                  '& img': { maxWidth: '100%', borderRadius: 2, marginTop: 2, marginBottom: 2 },
                  '& a': { color: 'primary.main', textDecoration: 'none' },
                  '& ul': { paddingLeft: 3 },
                  '& li': { marginBottom: 1 },
                }}
                dangerouslySetInnerHTML={{ 
                  __html: typeof section.content === 'string' 
                    ? section.content 
                    : section.content?.html || '' 
                }}
              />
            )}
          </Paper>
        ))}

        {/* Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              Projects
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              {portfolio.projects.map((project) => (
                <Paper
                  key={project.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  {project.featuredImage && (
                    <Box
                      component="img"
                      src={project.featuredImage}
                      alt={project.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                  )}
                  
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    {project.title}
                  </Typography>
                  
                  {project.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {project.technologies.map((tech, i) => (
                        <Box
                          key={i}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            borderRadius: 1,
                            fontSize: '0.85rem',
                            fontWeight: 500,
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {project.liveUrl && (
                      <MuiLink href={project.liveUrl} target="_blank" rel="noopener">
                        View Live →
                      </MuiLink>
                    )}
                    {project.githubUrl && (
                      <MuiLink href={project.githubUrl} target="_blank" rel="noopener">
                        GitHub →
                      </MuiLink>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 8, pt: 4, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {portfolio.user?.name}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
