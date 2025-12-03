"use client";

import { Paper, Typography } from "@mui/material";

export default function SectionCard({ section, onSizeCommit }) {
  return (
    <Paper
      sx={{
        width: section.width,
        height: section.height,
        minWidth: 300,
        minHeight: 150,
        p: 2,
        resize: "both",        // user can drag to resize
        overflow: "auto",
        boxSizing: "border-box",
        flex: "0 0 auto",      // keep its own width in flex layout
      }}
      onMouseUp={(e) => onSizeCommit(section.id, e)}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {section.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Resizable content area for {section.title}. Drag the bottom-right
        corner to change width and height.
      </Typography>
    </Paper>
  );
}
