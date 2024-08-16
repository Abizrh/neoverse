import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLanguage = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "md":
      return "markdown";
    default:
      return "typescript";
  }
};

export const initializeIndexedDB = () => {
  const request = indexedDB.open("NeovimSimulatorDB", 1);

  request.onerror = (event) => {
    console.error("IndexedDB error:", event);
  };

  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    console.log("IndexedDB opened successfully", db);
  };

  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    db.createObjectStore("files", { keyPath: "name" });
  };
};
