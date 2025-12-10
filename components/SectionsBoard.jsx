"use client";

import { Box, Button } from "@mui/material";
import SectionCard from "./SectionCard";

export default function SectionsBoard({
  sections,
  onSizeCommit,
  onAddSection,
  onUpdateSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleArchive,
  onImageUpload,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "80%",
        flexDirection: "column",
        alignItems: "center",
        mx: "auto",
        mt: 4,
        gap: 2,
      }}
    >
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          onSizeCommit={onSizeCommit}
          onUpdateSection={onUpdateSection}
          onDuplicateSection={onDuplicateSection}
          onDeleteSection={onDeleteSection}
          onToggleArchive={onToggleArchive}
          onImageUpload={(file) => onImageUpload(file, section.id)}
        />
      ))}

      <Button variant="outlined" onClick={onAddSection}>
        + Add Section
      </Button>
    </Box>
  );
}
