import * as React from "react";
import clsx from "clsx";

export const LogoutButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "border",
        "border-white/40",
        "hover:bg-white/10",
        "text-white",
        "text-sm",
        "px-3",
        "py-1",
        "rounded-md",
        "transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
