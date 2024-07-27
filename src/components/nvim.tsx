import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Cursor, FileSystemItem, Folder, Mode } from "@/types";

const isFolder = (item: FileSystemItem): item is Folder => "children" in item;

const NeovimSimulator: React.FC = () => {
  /**
   * States
   */
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      name: "project",
      depth: 5,
      children: [
        {
          name: "src",
          depth: 20,
          children: [
            {
              name: "index.ts",
              depth: 45,
              content: ['console.log("Hello, World!");'],
            },
            {
              name: "utils.ts",
              depth: 45,
              content: [
                "export const add = (a: number, b: number) => a + b;",
                `
export function multiply(a: number, b: number): number {
  return a * b;
}
                `,
              ],
            },
          ],
        },
        {
          name: "README.md",
          depth: 20,
          content: ["# My Project", "", "This is a sample project."],
        },
      ],
    },
  ]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [lines, setLines] = useState<string[]>([""]);
  const [mode, setMode] = useState<Mode>("normal");
  const [cursor, setCursor] = useState<Cursor>({ line: 0, ch: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [focusedCmp, setFocusedCmp] = useState<"fileSystem" | "editor">(
    "editor",
  );
  const [fileSystemCursor, setFileSystemCursor] = useState<number>(0);
  const [isSpacePressed, setIsSpacePressed] = useState(true);

  /**
   * Refs
   */
  const editorRef = useRef<HTMLPreElement>(null);
  const fileSystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedCmp === "fileSystem") {
      fileSystemRef.current?.focus();
    } else {
      editorRef.current?.focus();
    }
    if (isOpen) setMode("command");
  }, [isOpen, focusedCmp]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === " ") {
      e.preventDefault();
      setIsSpacePressed(true);
    }

    if (isSpacePressed && e.key === "e" && mode === "normal") {
      e.preventDefault();
      setFocusedCmp((prev) =>
        prev === "fileSystem" ? "editor" : "fileSystem",
      );
      setIsSpacePressed(false);
      return;
    }

    if (focusedCmp === "fileSystem") {
      handleFileSystemNavigation(e);
    } else {
      handleEditorNavigation(e);
    }
  };

  const handleFileSystemNavigation = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const flattenedFileSystem = flattenFileSystem(fileSystem);
    switch (e.key) {
      case "j":
      case "ArrowDown":
        setFileSystemCursor((prev) =>
          Math.min(prev + 1, flattenedFileSystem.length - 1),
        );
        break;
      case "k":
      case "ArrowUp":
        setFileSystemCursor((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        const selectedItem = flattenedFileSystem[fileSystemCursor];
        if (!isFolder(selectedItem)) {
          openFile(selectedItem);
          setFocusedCmp("editor");
        }
        break;
    }
  };

  const handleEditorNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (mode === "normal") {
      switch (e.key) {
        case "i":
          setMode("insert");
          break;
        case "v":
          setMode("visual");
          break;
        case "h":
        case "ArrowLeft":
          moveCursor(-1, 0);
          break;
        case "j":
        case "ArrowDown":
          moveCursor(0, 1);
          break;
        case "k":
        case "ArrowUp":
          moveCursor(0, -1);
          break;
        case "l":
        case "ArrowRight":
          moveCursor(1, 0);
          break;
        case "o":
          setMode("insert");
          insertNewLine();
          break;
        case ":":
          setIsOpen(true);
          setMode("command");
          break;
      }
    } else if (mode === "insert") {
      switch (e.key) {
        case "Escape":
          setMode("normal");
          break;
        case "Enter":
          insertNewLine();
          break;
        case "Backspace":
          deleteChar();
          break;
        case "ArrowLeft":
          moveCursor(-1, 0);
          break;
        case "ArrowRight":
          moveCursor(1, 0);
          break;
        case "ArrowUp":
          moveCursor(0, -1);
          break;
        case "ArrowDown":
          moveCursor(0, 1);
          break;
        default:
          if (e.key.length === 1) {
            insertChar(e.key);
          }
      }
    } else if (mode === "command") {
      setMode("normal");
    } else if (mode === "visual") {
      if (e.key === "Escape") {
        setMode("normal");
      }
    }
  };

  const moveCursor = (dx: number, dy: number) => {
    setCursor((prev) => {
      let newLine = Math.max(0, Math.min(lines.length - 1, prev.line + dy));
      let newCh = Math.max(0, Math.min(lines[newLine].length, prev.ch + dx));

      if (newLine !== prev.line) {
        newCh = dx > 0 ? 0 : lines[newLine].length;
      }

      return { line: newLine, ch: newCh };
    });
  };

  const insertChar = (char: string) => {
    setLines((prevLines) => {
      const newLines = [...prevLines];
      const line = newLines[cursor.line] || "";
      newLines[cursor.line] =
        line.slice(0, cursor.ch) + char + line.slice(cursor.ch);
      return newLines;
    });

    setCursor((prevCursor) => ({ ...prevCursor, ch: prevCursor.ch + 1 }));
    updateListSymbol();
  };

  const deleteChar = () => {
    if (cursor.ch > 0) {
      const newLines = [...lines];
      const line = newLines[cursor.line];
      newLines[cursor.line] =
        line.slice(0, cursor.ch - 1) + line.slice(cursor.ch);
      setLines(newLines);
      moveCursor(-1, 0);
    } else if (cursor.line > 0) {
      const newLines = [...lines];
      const previousLine = newLines[cursor.line - 1];
      const currentLine = newLines[cursor.line];
      newLines[cursor.line - 1] = previousLine + currentLine;
      newLines.splice(cursor.line, 1);
      setLines(newLines);
      setCursor({ line: cursor.line - 1, ch: previousLine.length });
    }
  };

  const insertNewLine = () => {
    const newLines = [...lines];
    const currentLine = newLines[cursor.line];
    newLines.splice(cursor.line + 1, 0, currentLine.slice(cursor.ch));
    newLines[cursor.line] = currentLine.slice(0, cursor.ch);
    setLines(newLines);
    setCursor({ line: cursor.line + 1, ch: 0 });
  };

  const updateListSymbol = () => {
    setLines((prevLines) => {
      const newLines = [...prevLines];
      const currentLine = newLines[cursor.line];

      if (currentLine.trim().startsWith("-")) {
        newLines[cursor.line] = currentLine.replace(/^\s*-/, "•");
      } else if (currentLine.trim().startsWith("x")) {
        newLines[cursor.line] = currentLine.replace(/^\s*x/, "☒");
      }

      return newLines;
    });
  };

  const openFile = (file: File) => {
    setCurrentFile(file);
    setLines(file.content);
    setCursor({ line: 0, ch: 0 });
  };

  const flattenFileSystem = (items: FileSystemItem[]): FileSystemItem[] => {
    return items.reduce((acc: FileSystemItem[], item) => {
      if (isFolder(item)) {
        return [...acc, item, ...flattenFileSystem(item.children)];
      }
      return [...acc, item];
    }, []);
  };

  const renderFileSystem = (items: FileSystemItem[]): JSX.Element[] => {
    const flattenedItems = flattenFileSystem(items);
    return flattenedItems.map((item, index) => (
      <div
        key={index}
        className="my-1"
        style={{
          backgroundColor:
            index === fileSystemCursor ? "#528bff" : "transparent",
          color: index === fileSystemCursor ? "#ffffff" : "#abb2bf",
        }}
      >
        {isFolder(item) ? (
          <span style={{ paddingLeft: `${item.depth}px` }}>📁 {item.name}</span>
        ) : (
          <span style={{ paddingLeft: `${item.depth}px` }}>
            📄
            {item.name}
          </span>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-row" onKeyDown={handleKeyDown}>
      {/* File system */}
      <div
        ref={fileSystemRef}
        tabIndex={0}
        style={{
          width: "20vw",
          height: "100vh",
          backgroundColor: "#252526",
          color: "#858585",
          fontFamily: "Consolas, monospace",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderFileSystem(fileSystem)}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}></div>
        <span
          style={{
            padding: "20px 20px",
            backgroundColor: "#21252b",
            color: "#98c379",
          }}
        >
          Mode: {mode.toUpperCase()} | File: {currentFile?.name || "None"}
        </span>
      </div>

      {/* Editor */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#1E1E1E",
          color: "#D4D4D4",
          fontFamily: "Consolas, monospace",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#252526",
              color: "#858585",
              textAlign: "right",
              userSelect: "none",
            }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre
            ref={editorRef}
            tabIndex={0}
            style={{
              flex: 1,
              padding: "10px",
              margin: 0,
              overflowY: "auto",
              position: "relative",
              outline: focusedCmp === "editor" ? "2px solid #528bff" : "none",
            }}
          >
            {lines.map((line, i) => (
              <div key={i}>
                {line}
                {i === cursor.line && focusedCmp === "editor" && (
                  <span
                    style={{
                      position: "absolute",
                      left: `${cursor.ch * 8.4}px`, // Approximate character width
                      height: "1.2em",
                      borderLeft:
                        mode === "insert"
                          ? "2px solid #528bff"
                          : "6px solid #528bff",
                    }}
                  />
                )}
              </div>
            ))}
          </pre>
        </div>
        <span
          style={{
            padding: "20px 20px",
            backgroundColor: "#21252b",
            color: "#98c379",
          }}
        >
          Cursor {cursor.line + 1}:{cursor.ch + 1}
        </span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a description of the dialog content.
            </DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here.</p>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeovimSimulator;
