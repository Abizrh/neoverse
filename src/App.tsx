import React, { useState } from "react";
import NeovimSimulator from "./components/nvim";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { File, FileSystemItem, Folder } from "./types";

const isFolder = (item: FileSystemItem): item is Folder => "children" in item;
function App() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      name: "project",
      children: [
        {
          name: "src",
          children: [
            { name: "index.ts", content: ['console.log("Hello, World!");'] },
            {
              name: "utils.ts",
              content: ["export const add = (a: number, b: number) => a + b;"],
            },
          ],
        },
        {
          name: "README.md",
          content: ["# My Project", "", "This is a sample project."],
        },
      ],
    },
  ]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  // const [isOpen, setIsOpen] = useState(false);
  const openFile = (file: File) => {
    setCurrentFile(file);
    // setLines(file.content);
    // setCursor({ line: 0, ch: 0 });
  };

  const renderFileSystem = (
    items: FileSystemItem[],
    depth = 0,
  ): JSX.Element[] => {
    return items.map((item, index) => (
      <div key={index} style={{ paddingLeft: `${depth * 20}px` }}>
        {isFolder(item) ? (
          <>
            <span>📁 {item.name}</span>
            {renderFileSystem(item.children, depth + 1)}
          </>
        ) : (
          <span onClick={() => openFile(item)} style={{ cursor: "pointer" }}>
            📄 {item.name}
          </span>
        )}
      </div>
    ));
  };

  return (
    <>
      <div>
        <NeovimSimulator />
      </div>
      {/* <NeovimSimulator /> */}
    </>
  );
}

export default App;
