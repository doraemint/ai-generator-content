import * as React from "react";
import clsx from "clsx";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "w-full px-4 py-2",
        "rounded-lg border border-gray-300 dark:border-neutral-700",
        "bg-white dark:bg-neutral-900",
        "text-gray-800 dark:text-gray-100",
        "placeholder-gray-400 dark:placeholder-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "transition-all duration-200 ease-in-out",
        "shadow-sm",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
