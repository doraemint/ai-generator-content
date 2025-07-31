import * as React from "react";
import clsx from "clsx";

export const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center",
        "px-5 py-2.5",
        "rounded-xl",
        "bg-gradient-to-r from-blue-600 to-indigo-600",
        "hover:from-blue-700 hover:to-indigo-700",
        "text-white font-medium",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-md hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
