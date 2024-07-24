export interface Cursor {
  line: number;
  ch: number;
}
export interface File {
  name: string;
  content: string[];
}

export interface Folder {
  name: string;
  children: (File | Folder)[];
}

export type Mode = "normal" | "insert" | "visual" | "command";

export type FileSystemItem = File | Folder;
