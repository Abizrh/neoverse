import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ThemeItem } from "@/types";

const themes: ThemeItem[] = [
  { value: "vsDark", label: "VS Dark" },
  { value: "vsLight", label: "VS Light" },
  { value: "dracula", label: "Dracula" },
  { value: "duotoneDark", label: "Duotone Dark" },
  { value: "duotoneLight", label: "Duotone Light" },
  { value: "nightOwl", label: "Night Owl" },
  { value: "oceanicNext", label: "Oceanic Next" },
  { value: "oneDark", label: "One Dark" },
  { value: "oneLight", label: "One Light" },
  { value: "panda", label: "Panda" },
  { value: "paraisoDark", label: "Paraiso Dark" },
  { value: "paraisoLight", label: "Paraiso Light" },
  { value: "seti", label: "Seti" },
  { value: "shadesOfPurple", label: "Shades of Purple" },
  { value: "solarizedDark", label: "Solarized Dark" },
  { value: "solarizedLight", label: "Solarized Light" },
  { value: "synthwave84", label: "Synthwave 84" },
  { value: "twilight", label: "Twilight" },
  { value: "ultramin", label: "ultramin" },
];

interface ThemeProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
  currentTheme: string;
}

const Theme: React.FC<ThemeProps> = ({
  isOpen,
  setIsOpen,
  onThemeChange,
  onClose,
  currentTheme,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const currentIndex = themes.findIndex(
        (theme) => theme.value === currentTheme,
      );
      setFocusedIndex(currentIndex !== -1 ? currentIndex : 0);
    }
  }, [isOpen, currentTheme]);

  // FIXME: after closing the dialog (Enter), the cursor is not set in the editor. so i have to set it manually
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : themes.length - 1,
        );
        onThemeChange(
          themes[focusedIndex > 0 ? focusedIndex - 1 : themes.length - 1].value,
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < themes.length - 1 ? prevIndex + 1 : 0,
        );
        onThemeChange(
          themes[focusedIndex < themes.length - 1 ? focusedIndex + 1 : 0].value,
        );
        break;
      case "Enter":
        event.preventDefault();
        // onThemeChange(themes[focusedIndex].value);
        // setFocusedIndex(0);
        // onClose();
        break;
    }
  };

  const CustomSelectItem = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof SelectItem> & { index: number }
  >(({ children, index, ...props }, forwardedRef) => {
    const isSelected = index === focusedIndex;

    return (
      <SelectItem
        ref={forwardedRef}
        {...props}
        onMouseEnter={() => {
          setFocusedIndex(index);
          onThemeChange(themes[index].value);
        }}
        className={`${props.className} ${isSelected ? "bg-accent text-accent-foreground" : ""}`}
      >
        {children}
      </SelectItem>
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[rgba(255,255,255,0.28)] backdrop-blur-[3.8px] border border-[rgba(255,255,255,0.31)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Theme Selection</DialogTitle>
          <DialogDescription className="text-white">
            Use arrow keys to preview themes instantly
          </DialogDescription>
        </DialogHeader>
        <Select value={currentTheme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent
            ref={selectRef}
            onKeyDown={handleKeyDown}
            className="bg-[rgba(255,255,255,0.28)] backdrop-blur-[3.8px] border border-[rgba(255,255,255,0.31)] shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          >
            {themes.map((theme, index) => (
              <CustomSelectItem
                className="bg-[rgba(255,255,255,0.28)] backdrop-blur-[3.8px]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
                key={theme.value}
                value={theme.value}
                index={index}
              >
                {theme.label}
              </CustomSelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
};

export default Theme;
