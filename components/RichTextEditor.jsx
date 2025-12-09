// components/RichTextEditor.jsx
"use client";

import * as React from "react";
import { Box, Button, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";

export default function RichTextEditor({
  initialValue,
  onChange,
  onDone,
  onImageUpload,
}) {
  const [draftContent, setDraftContent] = React.useState(initialValue || "");
  const editorRef = React.useRef(null);

  const [anchorTextColor, setAnchorTextColor] = React.useState(null);
  const [anchorHighlight, setAnchorHighlight] = React.useState(null);

  const openTextColor = Boolean(anchorTextColor);
  const openHighlight = Boolean(anchorHighlight);

  // Sync editor when initialValue changes
  React.useEffect(() => {
    const html = initialValue || "";
    setDraftContent(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  }, [initialValue]);

  // Helper: sync local draft from DOM
  const updateDraftFromDom = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setDraftContent(html);
      console.log('Updated content:', html.substring(0, 100)); // Debug log
    }
  };

  // Apply execCommand
  const applyCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateDraftFromDom();
  };

  // Insert raw HTML at caret
  const insertHtml = (html) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, html);
      updateDraftFromDom();
    }
  };

  const handleContentInput = () => {
    updateDraftFromDom();
  };

  // Upload button
  const handleUploadClick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name);

    let url = null;
    if (onImageUpload) {
      try {
        url = await onImageUpload(file);
        console.log('Got URL:', url?.substring(0, 50));
      } catch (err) {
        console.error('Upload error:', err);
        alert('Failed to upload image');
        return;
      }
    } else {
      url = URL.createObjectURL(file);
    }

    if (!url) {
      console.error('No URL returned');
      return;
    }

    // Insert image at cursor position
    const imgHtml = `<img src="${url}" style="max-width: 100%; border-radius: 4px; margin: 8px 0; display: block;" alt="${file.name}" />`;
    insertHtml(imgHtml);
    
    // Clear the file input so same file can be uploaded again
    e.target.value = '';
  };

  const handleAddLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    applyCommand("createLink", url);
  };

  const handleInsertCodeBlock = () => {
    insertHtml("<pre><code>// your code here</code></pre>");
  };

  const handleInsertBlockquote = () => {
    applyCommand("formatBlock", "<blockquote>");
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 4px;">
        <tr>
          <td style="padding:4px;">Cell 1</td>
          <td style="padding:4px;">Cell 2</td>
        </tr>
        <tr>
          <td style="padding:4px;">Cell 3</td>
          <td style="padding:4px;">Cell 4</td>
        </tr>
      </table>
    `;
    insertHtml(tableHtml);
  };

  const handleInsertEmoji = (emoji) => {
    insertHtml(emoji);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    let url = null;
    if (onImageUpload) {
      try {
        url = await onImageUpload(file);
      } catch (err) {
        console.error('Drop upload error:', err);
        return;
      }
    } else {
      url = URL.createObjectURL(file);
    }

    if (!url) return;

    insertHtml(
      `<img src="${url}" style="max-width: 100%; border-radius: 4px; margin: 8px 0; display: block;" />`
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDone = () => {
    console.log('Saving content, length:', draftContent.length);
    if (onChange) {
      onChange(draftContent);
    }
    if (onDone) {
      onDone();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <IconButton size="small" onClick={() => applyCommand("bold")}>
          <FormatBoldIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" onClick={() => applyCommand("italic")}>
          <FormatItalicIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" onClick={() => applyCommand("underline")}>
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => applyCommand("insertUnorderedList")}
        >
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>

        <select
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return;
            applyCommand("formatBlock", `<${value}>`);
          }}
          defaultValue=""
          style={{ padding: "4px", borderRadius: 4, fontSize: 12 }}
        >
          <option value="" disabled>
            Heading
          </option>
          <option value="p">Normal</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>

        <select
          onChange={(e) => applyCommand("fontName", e.target.value)}
          defaultValue=""
          style={{ padding: "4px", borderRadius: 4, fontSize: 12 }}
        >
          <option value="" disabled>
            Font
          </option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
        </select>

        <IconButton
          size="small"
          onClick={(e) => setAnchorTextColor(e.currentTarget)}
          title="Text color"
        >
          <FormatColorTextIcon fontSize="small" />
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorTextColor}
          open={openTextColor}
          onClose={() => setAnchorTextColor(null)}
        >
          <Box sx={{ p: 1 }}>
            <input
              type="color"
              onChange={(e) => {
                applyCommand("foreColor", e.target.value);
                setAnchorTextColor(null);
              }}
              style={{ width: 32, height: 32, border: "none" }}
            />
          </Box>
        </Menu>

        <IconButton
          size="small"
          onClick={(e) => setAnchorHighlight(e.currentTarget)}
          title="Highlight"
        >
          <BorderColorIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorHighlight}
          open={openHighlight}
          onClose={() => setAnchorHighlight(null)}
        >
          <Box sx={{ p: 1 }}>
            <input
              type="color"
              onChange={(e) => {
                applyCommand("hiliteColor", e.target.value);
                setAnchorHighlight(null);
              }}
              style={{ width: 32, height: 32, border: "none" }}
            />
          </Box>
        </Menu>

        <IconButton size="small" onClick={() => applyCommand("justifyLeft")}>
          <FormatAlignLeftIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => applyCommand("justifyCenter")}>
          <FormatAlignCenterIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => applyCommand("justifyRight")}>
          <FormatAlignRightIcon fontSize="small" />
        </IconButton>

        <Button size="small" variant="outlined" onClick={handleInsertBlockquote}>
          Quote
        </Button>
        <Button size="small" variant="outlined" onClick={handleInsertCodeBlock}>
          {"</>"}
        </Button>
        <Button size="small" variant="text" onClick={handleAddLink}>
          Link
        </Button>
        <Button size="small" variant="text" onClick={handleInsertTable}>
          Table
        </Button>

        <Button
          variant="outlined"
          size="small"
          component="label"
          sx={{ ml: "auto" }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUploadClick}
          />
        </Button>
      </Box>

      {/* Editable area */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 1,
          p: 2,
          minHeight: 120,
          fontSize: 14,
          "&:focus": {
            outline: "2px solid #3b82f6",
          },
          "& img": {
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "8px 0",
          },
        }}
      />

      <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" size="small" onClick={handleDone}>
          Done
        </Button>
      </Box>
    </Box>
  );
}
