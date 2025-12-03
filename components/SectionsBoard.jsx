"use client";

import { Box, Button } from "@mui/material";
import SectionCard from "./SectionCard";

export default function SectionsBoard({
  sections,
  onSizeCommit,
  onAddSection,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "80%",
        flexDirection: "column", // stack Paper + Button vertically
        alignItems: "center", // center both horizontally
        mx: "auto",
        mt: 4,
        gap: 2, // spacing between Paper and Button
      }}
    >
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          onSizeCommit={onSizeCommit}
        />
      ))}

      <Button variant="outlined" onClick={onAddSection}>
        + Add Section
      </Button>
    </Box>
  );
}
