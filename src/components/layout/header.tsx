import React from "react";
import ThemeToggle from "./switcher";

const Navbar: React.FC = () => {
  return (
    <nav className="h-16 max-w-4xl mx-auto flex items-center justify-between px-6 lg:px-0">
      <div className="flex items-center gap-x-2">
        <img src="/logo.png" alt="Neoverse" width="26" />
        <span className="text-lg font-bold font-display">Neoverse</span>
      </div>
      <div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
