// components/SectionCard.jsx
"use client";

import * as React from "react";
import {
  Paper,
  Typography,
  Menu,
  Button,
  MenuItem,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import RichTextEditor from "./RichTextEditor";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function SectionCard({
  section,
  onSizeCommit,
  onUpdateSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleArchive,
  onImageUpload,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editTitleDialogOpen, setEditTitleDialogOpen] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState(section.title);

  // Upload feedback
  const [uploadStatus, setUploadStatus] = React.useState(null); // { status: 'uploading' | 'success' | 'error', fileName: string }

  const open = Boolean(anchorEl);
  const isArchived = section.archived;

  const handleClickMenuButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    setIsEditing(true);
    handleCloseMenu();
  };

  const handleClickEditTitle = () => {
    setEditTitleDialogOpen(true);
    handleCloseMenu();
  };

  const handleSaveTitle = () => {
    onUpdateSection(section.id, { title: draftTitle });
    setEditTitleDialogOpen(false);
  };

  const handleClickDuplicate = () => {
    onDuplicateSection(section.id);
    handleCloseMenu();
  };

  const handleClickArchive = () => {
    onToggleArchive(section.id);
    handleCloseMenu();
  };

  const handleClickDelete = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onDeleteSection(section.id);
    setDeleteDialogOpen(false);
  };

  // When editor saves, update section content
  const handleRichContentChange = (html) => {
    onUpdateSection(section.id, { content: html });
  };

  // For uploads: show progress and save image
  const handleImageUpload = async (file) => {
    setUploadStatus({ status: 'uploading', fileName: file.name });

    try {
      const url = await onImageUpload(file);
      setUploadStatus({ status: 'success', fileName: file.name });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);

      return url;
    } catch (error) {
      setUploadStatus({ status: 'error', fileName: file.name });
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
      throw error;
    }
  };

  return (
    <Paper
      sx={{
        position: "relative",
        width: section.width,
        minWidth: 300,
        minHeight: 150,
        p: 2,
        pt: 5,
        resize: "both",
        overflow: "auto",
        boxSizing: "border-box",
        flex: "0 0 auto",
        opacity: isArchived ? 0.6 : 1,
        borderStyle: isArchived ? "dashed" : "solid",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
      }}
      onMouseUp={(e) => onSizeCommit(section.id, e)}
    >
      {/* Top-right Options button */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <Button
          id={`section-${section.id}-options-button`}
          aria-controls={open ? `section-${section.id}-menu` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="text"
          size="small"
          disableElevation
          onClick={handleClickMenuButton}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Options
        </Button>
        <StyledMenu
          id={`section-${section.id}-menu`}
          slotProps={{
            list: {
              "aria-labelledby": `section-${section.id}-options-button`,
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleClickEdit} disableRipple>
            <EditIcon />
            Edit Content
          </MenuItem>
          <MenuItem onClick={handleClickEditTitle} disableRipple>
            <EditIcon />
            Edit Title
          </MenuItem>
          <MenuItem onClick={handleClickDuplicate} disableRipple>
            <FileCopyIcon />
            Duplicate
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleClickArchive} disableRipple>
            {isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
            {isArchived ? "Unarchive" : "Archive"}
          </MenuItem>
          <MenuItem onClick={handleClickDelete} disableRipple>
            <DeleteIcon />
            Delete
          </MenuItem>
        </StyledMenu>
      </Box>

      {/* Delete confirm dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete section?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{section.title}</strong>?
            This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button color="error" onClick={handleConfirmDelete} autoFocus>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit title dialog */}
      <Dialog open={editTitleDialogOpen} onClose={() => setEditTitleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Section Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Section Title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTitleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTitle} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title + archived chip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {section.title}
        </Typography>
        {isArchived && <Chip label="Archived" size="small" />}
      </Box>

      {/* Upload status feedback */}
      {uploadStatus && (
        <Box sx={{ mb: 2 }}>
          {uploadStatus.status === 'uploading' && (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              Uploading {uploadStatus.fileName}...
              <LinearProgress sx={{ mt: 1 }} />
            </Alert>
          )}
          {uploadStatus.status === 'success' && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              {uploadStatus.fileName} uploaded successfully!
            </Alert>
          )}
          {uploadStatus.status === 'error' && (
            <Alert severity="error">
              Failed to upload {uploadStatus.fileName}
            </Alert>
          )}
        </Box>
      )}

      {/* Content area */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {isEditing ? (
          <RichTextEditor
            initialValue={section.content || ""}
            onChange={handleRichContentChange}
            onDone={() => setIsEditing(false)}
            onImageUpload={handleImageUpload}
          />
        ) : (
          <>
            {section.content ? (
              <Box
                sx={{
                  "& p": { margin: 0, marginBottom: "0.35rem" },
                  "& ul": { paddingLeft: "1.2rem", margin: 0 },
                  "& li": { marginBottom: "0.1rem" },
                  "& img": { maxWidth: "100%", borderRadius: 1, marginTop: 1, marginBottom: 1 },
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Resizable content area for {section.title}. Click Options → Edit Content
                to add rich text and images.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}
