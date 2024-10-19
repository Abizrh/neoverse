import React, { useState, useRef, useEffect, useCallback } from "react";
import { Cursor, FileSystemItem, Folder, Mode, File, TypeMode } from "@/types";
import { Highlight, themes } from "prism-react-renderer";
import { getLanguage, initializeIndexedDB } from "@/lib/utils";
import FileStatusDisplay from "./status";
import Theme from "./theme";

const isFolder = (item: FileSystemItem): item is Folder => "children" in item;
const theme = localStorage.getItem("theme") || "vsDark";

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
              content: [
                "// This is a single-line comment",
                "/* This is a",
                "   multi-line comment */",
                'const greeting: string = "Hello, World!";',
                "let count: number = 42;",
                "function printGreeting(name: string): void {",
                "  console.log(`${greeting} My name is ${name}.`);",
                "}",
                "class Person {",
                "  constructor(private name: string) {}",
                "  greet() {",
                "    printGreeting(this.name);",
                "  }",
                "}",
                'const john = new Person("John");',
                "john.greet();",
              ],
            },
            {
              name: "utils.ts",
              depth: 45,
              content: [""],
            },
            {
              name: "type.ts",
              depth: 45,
              content: [""],
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
  const [isOpenTheme, setIsOpenTheme] = useState(false);
  const [focusedCmp, setFocusedCmp] = useState<"fileSystem" | "editor">(
    "editor",
  );
  const [fileSystemCursor, setFileSystemCursor] = useState<number>(0);
  const [isSpacePressed, setIsSpacePressed] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [keyPressed, setKeyPressed] = useState<string[]>([]);

  /**
   * Refs
   */
  const editorRef = useRef<HTMLPreElement>(null);
  const fileSystemRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keyPressedRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Callbacks
   */
  const scrollToCursor = useCallback(() => {
    if (editorRef.current && cursorRef.current) {
      const editorRect = editorRef.current.getBoundingClientRect();
      const cursorRect = cursorRef.current.getBoundingClientRect();

      if (cursorRect.bottom > editorRect.bottom) {
        editorRef.current.scrollTop += cursorRect.bottom - editorRect.bottom;
      } else if (cursorRect.top < editorRect.top) {
        editorRef.current.scrollTop -= editorRect.top - cursorRect.top;
      }
    }
  }, []);

  const deleteLine = useCallback(() => {
    // newLine a line that the character is has been deleted
    const newLines = [...lines];

    //lines otherwise still have the deleted line and content

    // TODO: we have to store the cursor.line position
    // and then we can filter out the deleted line and content and we can set the value to undoLine
    newLines.splice(cursor.line, 1);
    setLines(newLines);
    setCursor({ line: cursor.line, ch: 0 });
  }, [cursor, lines]);

  const undoLine = useCallback(() => {
    if (cursor.line > 0) {
      const newLines = [...lines];
      newLines.splice(cursor.line, 1);
      newLines.splice(cursor.line, 0, lines[cursor.line]);
      setLines(newLines);
      setCursor({ line: cursor.line, ch: lines[cursor.line].length });
    }
  }, [cursor, lines]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (mode === TypeMode.NORMAL) {
        keyPressedRef.current.push(event.key);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          if (
            keyPressedRef.current.includes("d") &&
            keyPressedRef.current.length === 2
          ) {
            deleteLine();
          } else if (keyPressedRef.current.includes("u")) {
            undoLine();
          }
          keyPressedRef.current = [];
        }, 200);
      }
    },
    [mode, deleteLine, undoLine],
  );

  /**
   * Effects
   */
  useEffect(() => {
    if (focusedCmp === "fileSystem") {
      fileSystemRef.current?.focus();
    } else {
      editorRef.current?.focus();
    }
    if (isOpenTheme) setMode("command");
  }, [isOpenTheme, focusedCmp]);

  useEffect(() => {
    initializeIndexedDB();
  }, []);

  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      scrollToCursor();
    }, 50);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [cursor, scrollToCursor]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyPress]);

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleCloseThemeDialog = () => {
    setIsOpenTheme(false);
  };

  const saveToIndexedDB = () => {
    if (!currentFile) return;
    console.log("saving...");

    setIsSaving(true);
    setSaveMessage("Saving...");

    const request = indexedDB.open("NeovimSimulatorDB", 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");

      const updatedFile = { ...currentFile, content: lines };
      const putRequest = objectStore.put(updatedFile);

      putRequest.onsuccess = () => {
        setIsSaving(false);
        setSaveMessage("File saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      };

      putRequest.onerror = () => {
        setIsSaving(false);
        setSaveMessage("Error saving file.");
        setTimeout(() => setSaveMessage(""), 3000);
      };
    };

    request.onerror = () => {
      setIsSaving(false);
      setSaveMessage("Error opening database.");
      setTimeout(() => setSaveMessage(""), 3000);
    };
  };

  // WARN: need to think a possible approach to handle more key binds
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === " ") {
      e.preventDefault();
      setIsSpacePressed(true);
    }

    //NOTE: handler for switching between file system and editor
    if (isSpacePressed && e.key === "e" && mode === "normal") {
      e.preventDefault();
      setFocusedCmp((prev) =>
        prev === "fileSystem" ? "editor" : "fileSystem",
      );
      setIsSpacePressed(false);
      return;
    }

    if (isSpacePressed && e.key === "t" && mode === "normal") {
      e.preventDefault();

      setIsOpenTheme(true);
      setMode("command");
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
      case "Enter": {
        const selectedItem = flattenedFileSystem[fileSystemCursor];
        if (!isFolder(selectedItem)) {
          openFile(selectedItem);
          setFocusedCmp("editor");
        }
        break;
      }
    }
  };

  const handleEditorNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (mode === "normal") {
      switch (e.key) {
        case "d":
          setKeyPressed((prevKeyPressed) => {
            const newKeyPressed = [...prevKeyPressed, "d"];
            return newKeyPressed;
          });
          break;
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
        case "u":
          deleteChar();
          break;
        case "w":
          e.preventDefault();
          saveToIndexedDB();
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
      const newLine = Math.max(0, Math.min(lines.length - 1, prev.line + dy));
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
    const request = indexedDB.open("NeovimSimulatorDB", 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const getRequest = objectStore.get(file.name);

      getRequest.onsuccess = () => {
        const savedFile = getRequest.result;
        if (savedFile) {
          setCurrentFile(savedFile);
          setLines(savedFile.content);
        } else {
          setCurrentFile(file);
          setLines(file.content);
        }
        setCursor({ line: 0, ch: 0 });
      };

      getRequest.onerror = () => {
        console.error("Error retrieving file from IndexedDB");
        setCurrentFile(file);
        setLines(file.content);
        setCursor({ line: 0, ch: 0 });
      };
    };

    request.onerror = () => {
      console.error("Error opening IndexedDB");
      setCurrentFile(file);
      setLines(file.content);
      setCursor({ line: 0, ch: 0 });
    };
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
          backgroundColor: "#1E1E1E",
          color: "#858585",
          fontFamily: "Consolas, monospace",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderFileSystem(fileSystem)}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}></div>
        <FileStatusDisplay
          mode={mode}
          currentFile={currentFile}
          isUnsaved={isSaving}
          saveMessage={saveMessage}
        />
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
            <Highlight
              theme={themes[currentTheme as keyof typeof themes]}
              code={lines.join("\n")}
              language={getLanguage(currentFile?.name || "")}
            >
              {({ tokens, getLineProps, getTokenProps }) => (
                <>
                  {tokens.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      {...getLineProps({ line })}
                      style={{ position: "relative", minHeight: "1.2em" }}
                    >
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                      {lineIndex === cursor.line && focusedCmp === "editor" && (
                        <span
                          ref={cursorRef}
                          style={{
                            position: "absolute",
                            left: `${cursor.ch * 8.4}px`,
                            top: 0,
                            height: "1.2em",
                            borderLeft:
                              mode === "insert"
                                ? "2px solid #007ACC"
                                : "6px solid #007ACC",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </Highlight>
          </pre>
        </div>
        <span
          style={{
            padding: "20px 20px",
            backgroundColor: "#21252b",
            color: "#98c379",
          }}
        >
          Cursor {cursor.line + 1}:{cursor.ch + 1} * {saveMessage}
        </span>
      </div>
      <Theme
        isOpen={isOpenTheme}
        setIsOpen={setIsOpenTheme}
        onThemeChange={handleThemeChange}
        onClose={handleCloseThemeDialog}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default NeovimSimulator;
