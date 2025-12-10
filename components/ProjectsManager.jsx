"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function ProjectsManager({ 
  projects = [], 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featuredImage: '',
    isFeatured: false,
  });

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        technologies: project.technologies?.join(', ') || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featuredImage: project.featuredImage || '',
        isFeatured: project.isFeatured || false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        featuredImage: '',
        isFeatured: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSave = () => {
    const projectData = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    if (editingProject) {
      onUpdateProject(editingProject.id, projectData);
    } else {
      onAddProject(projectData);
    }

    handleCloseDialog();
  };

  const handleDelete = (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      onDeleteProject(projectId);
    }
  };

  const handleToggleFeatured = (project) => {
    onUpdateProject(project.id, { isFeatured: !project.isFeatured });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No projects yet
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Add Your First Project
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="600">
                      {project.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleFeatured(project)}
                      color={project.isFeatured ? 'primary' : 'default'}
                    >
                      {project.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  {project.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      {project.technologies.map((tech, i) => (
                        <Chip key={i} label={tech} size="small" />
                      ))}
                    </Box>
                  )}

                  {(project.liveUrl || project.githubUrl) && (
                    <Box sx={{ mt: 1 }}>
                      {project.liveUrl && (
                        <Typography variant="caption" display="block">
                          🔗 {project.liveUrl}
                        </Typography>
                      )}
                      {project.githubUrl && (
                        <Typography variant="caption" display="block">
                          💻 {project.githubUrl}
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(project)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(project.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Project Title *"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <TextField
              label="Technologies (comma-separated)"
              fullWidth
              placeholder="React, Node.js, PostgreSQL"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              helperText="Separate multiple technologies with commas"
            />

            <TextField
              label="Live URL"
              fullWidth
              placeholder="https://example.com"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            />

            <TextField
              label="GitHub URL"
              fullWidth
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />

            <TextField
              label="Featured Image URL"
              fullWidth
              placeholder="https://example.com/image.jpg"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              helperText="Optional: URL to project screenshot"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <Typography>Mark as featured project</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.title}
          >
            {editingProject ? 'Save Changes' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
