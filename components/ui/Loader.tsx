import React from "react";

interface LoaderProps {
  /** If true, centers the loader on the entire screen with a dark background */
  fullScreen?: boolean;
  /** Controls the dimensions and border thickness */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional text to display below the spinner */
  text?: string;
  /** Optional extra classes to override colors or margins */
  className?: string;
}

export default function Loader({
  fullScreen = false,
  size = "md",
  text,
  className = "",
}: LoaderProps) {
  // Map our size props to Tailwind utility classes
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const spinnerContent = (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div
        className={`${sizeMap[size]} border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin`}
      ></div>
      {text && (
        <div className="text-indigo-400 text-sm font-medium tracking-wide animate-pulse">
          {text}
        </div>
      )}
    </div>
  );

  // If fullScreen is true, wrap it in the massive background div
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  // Otherwise, just return the raw spinner to fit wherever it's placed
  return spinnerContent;
}
