import React from "react";
import { Badge } from "@/components/ui/badge";

type FileStatusDisplayProps = {
  mode: string;
  currentFile: { name: string } | null;
  isUnsaved: boolean;
};
// {mode.toLowerCase() === "insert" && isUnsaved && (
//   <Badge variant="destructive" className="absolute -top-2 -right-2">
//   Unsaved
//   </Badge>
// )}

const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({
  mode,
  currentFile,
  isUnsaved,
}) => {
  // console.log("isUnsaved", isUnsaved);
  return (
    // <div className="relative inline-block">
    <span
      style={{
        padding: "20px 20px",
        backgroundColor: "#21252b",
        color: "#98c379",
      }}
    >
      {isUnsaved}
      Mode: {mode.toUpperCase()} | File: {currentFile?.name || "None"}
    </span>
    // </div>
  );
};

export default FileStatusDisplay;
