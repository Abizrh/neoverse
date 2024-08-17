import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Class-based          | Tag-based           | Description
 * -------------------- | ------------------- | -----------
 * .class               | class="class"       | Adds a class to an element
 * .class.class         | class="class class" | Adds multiple classes to an element
 * @param inputs - The input classes
 * @returns The merged classes
 * @example
 * cn("class", "class2") // returns "class class2"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the language based on the file extension
 * @param fileName - The file name
 * @returns The language
 */
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

/**
 * Initializes IndexedDB
 */
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
