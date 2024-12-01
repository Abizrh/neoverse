import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Kbd from "../ui/kbd";

const shortcuts = [
  { key: "esc", description: "Return to normal mode | quit editor" },
  { key: "w", description: "Save file" },
  { key: "Space e", description: "Open file" },
  { key: "Space t", description: "Change theme" },
  { key: "Shift :", description: "Open command line" },
];

interface HelpProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Help: React.FC<HelpProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900 text-gray-300 rounded-lg p-5 max-w-md shadow-lg">
        <DialogTitle className="text-green-400 text-lg font-semibold">
          ⚙️ Help - Shortcut Keys
        </DialogTitle>
        <DialogDescription className="mt-4">
          <ul className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-green-500 font-mono">
                  <Kbd.Shortcut keys={shortcut.key.split(" ")} variant="soft" />
                </span>
                <span className="text-gray-400">{shortcut.description}</span>
              </li>
            ))}
          </ul>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default Help;
