import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Terminal as TerminalIcon, X } from "lucide-react";

interface CommandEntry {
  command: string;
  output: string;
  timestamp: string;
}

const Terminal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [history, setHistory] = useState<CommandEntry[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    let output = "";
    const _cmd = command.trim();

    if (_cmd === "clear") {
      setHistory([]);
      return;
    } else if (_cmd === "date") {
      output = new Date().toString();
    } else if (_cmd === "help") {
      output = "Available commands: clear, date, help, exit";
    } else if (_cmd === "exit") {
      setIsOpen(false);
      return;
    } else if (_cmd === "ls") {
      output = "📁 src 📄 index.ts 📄 utils.ts 📄 type.ts";
    } else if (_cmd !== "") {
      output = `zsh: command not found: ${_cmd}`;
    }

    setHistory([...history, { command, output, timestamp }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentCommand);
      setCurrentCommand("");
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [history, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl h-[60vh] p-0 bg-transparent border-0">
        <Card className="w-full h-full bg-[#1a1b26] bg-opacity-30 backdrop-blur-md backdrop-saturate-150 font-mono relative overflow-hidden border-0 rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-2 bg-[#1a1b26] bg-opacity-90 border-b border-gray-800">
            <DialogTitle className="flex items-center gap-2 text-gray-300">
              <TerminalIcon className="w-4 h-4" />
              Terminal
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-2.5rem)] p-4" ref={scrollAreaRef}>
            <div className="text-gray-500 text-sm mb-4">
              Welcome to Terminal. Type 'help' for available commands. Type
              'exit' or press ESC to close.
            </div>
            {history.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#7aa2f7]">guest</span>
                  <span className="text-gray-500">@</span>
                  <span className="text-[#bb9af7]">local</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-[#e0af68]">~</span>
                  <span className="text-gray-500">$</span>
                  <span className="text-gray-300">{entry.command}</span>
                </div>
                {entry.output && (
                  <div className="mt-1 text-gray-300">
                    {entry.output.split("\n").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-[#7aa2f7]">guest</span>
              <span className="text-gray-500">@</span>
              <span className="text-[#bb9af7]">local</span>
              <span className="text-gray-500">:</span>
              <span className="text-[#e0af68]">~</span>
              <span className="text-gray-500">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-600"
                autoFocus
              />
            </div>
          </ScrollArea>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Terminal;
