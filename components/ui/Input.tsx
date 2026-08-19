import { type InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 rounded-md border px-3 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-amber-500 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          } bg-white dark:bg-zinc-900 ${className}`}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
