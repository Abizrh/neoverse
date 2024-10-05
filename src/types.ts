export interface Cursor {
  line: number;
  ch: number;
}
export interface File {
  name: string;
  depth: number;
  content: string[];
}

export interface Folder {
  name: string;
  depth: number;
  children: (File | Folder)[];
}

export type Mode = "normal" | "insert" | "visual" | "command";

export type FileSystemItem = File | Folder;

export interface SyntaxSegment {
  text: string;
  style?: React.CSSProperties;
}

export interface ThemeItem {
  value: string;
  label: string;
}

export enum TypeMode {
  NORMAL = "normal",
  INSERT = "insert",
  VISUAL = "visual",
  COMMAND = "command",
}
