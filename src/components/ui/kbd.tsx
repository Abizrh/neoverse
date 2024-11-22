import React from "react";
import { Keyboard } from "lucide-react";

type KbdVariant = "default" | "primary" | "dark" | "soft" | "danger";
type KbdSize = "sm" | "md" | "lg";

interface KbdKeyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: KbdVariant;
  size?: KbdSize;
  icon?: boolean;
}

interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLDivElement> {
  keys: string[];
  separator?: string;
  variant?: KbdVariant;
  size?: KbdSize;
}

const KbdKey: React.FC<KbdKeyProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  icon = false,
  ...props
}) => {
  // variants
  const variantStyles: Record<KbdVariant, string> = {
    default: "bg-white text-gray-800 border border-gray-300",
    primary: "bg-blue-500 text-white",
    dark: "bg-gray-800 text-gray-200 border border-gray-600",
    soft: "bg-gray-100 text-gray-700",
    danger: "bg-red-500 text-white",
  };

  // sizes
  const sizeStyles: Record<KbdSize, string> = {
    sm: "px-1 py-0.5 text-xs rounded",
    md: "px-2 py-1 text-sm rounded-md",
    lg: "px-3 py-2 text-base rounded-lg",
  };

  return (
    <kbd
      className={`
        inline-flex items-center justify-center 
        font-medium 
        shadow-sm 
        select-none 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${className}
      `}
      {...props}
    >
      {icon && <Keyboard className="mr-1 h-4 w-4" />}
      {children}
    </kbd>
  );
};

const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  keys = [],
  separator = "+",
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center space-x-1 ${className}`}
      {...props}
    >
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500 mx-1">{separator}</span>}
          <KbdKey variant={variant} size={size}>
            {key}
          </KbdKey>
        </React.Fragment>
      ))}
    </div>
  );
};

const Kbd = {
  Key: KbdKey,
  Shortcut: KeyboardShortcut,
};

export default Kbd;
