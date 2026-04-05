import React, { useId } from "react";

type InputProps = {
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = "text", className = "", ...props },
  ref,
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-1 inline-block pl-1 text-sm font-medium text-stone-700 dark:text-stone-300"
          htmlFor={id}
        >
          {label}
        </label>
      )}{" "}
      <input
        ref={ref}
        {...props}
        type={type}
        id={id}
        className={`w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition duration-200 placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-emerald-400 dark:focus:bg-stone-800 ${className}`}
      />
    </div>
  );
});

export default Input;
