import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem("color-theme");
    return storedTheme ? storedTheme === "dark" : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  return (
    <Button variant="default" aria-label="Theme" onClick={toggleTheme}>
      {isDark ? "🌙" : "🌞"}
    </Button>
  );
};

export default ThemeToggle;
