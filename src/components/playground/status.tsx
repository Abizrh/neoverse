import React from "react";

type FileStatusDisplayProps = {
  mode: string;
  currentFile: { name: string } | null;
  isUnsaved: boolean;
  saveMessage: string;
};

const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({
  mode,
  currentFile,
}) => {
  return (
    <span
      style={{
        padding: "20px 20px",
        backgroundColor: "#21252b",
        color: "#98c379",
      }}
    >
      Mode: {mode.toUpperCase()} | File: {currentFile?.name || "None"}
    </span>
  );
};

export default FileStatusDisplay;
