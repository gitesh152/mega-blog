import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly type?: "button" | "submit" | "reset";
  readonly bgColor?: string;
  readonly textColor?: string;
  readonly className?: string;
}

function Button({
  children,
  type = "button",
  bgColor = "bg-emerald-600 hover:bg-emerald-700",
  textColor = "text-white",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-stone-950 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
