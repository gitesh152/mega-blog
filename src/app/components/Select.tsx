import React, { useId, type ForwardedRef } from "react";

type SelectProps = {
  options: string[];
  label?: string;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = (
  { options, label, className, ...props }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) => {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 inline-block pl-1 text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {label}
        </label>
      )}

      <select
        {...props}
        id={id}
        ref={ref}
        className={`w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-emerald-400 dark:focus:bg-stone-800 ${className}`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default React.forwardRef<HTMLSelectElement, SelectProps>(Select);
