import React from "react";
import { cn } from "../../utils/cn";

export type InputProps = {
  className?: string;
  type?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  id?: string;
  name?: string;
  value?: any;
  checked?: boolean;
  onChange?: (e: any) => void;
  placeholder?: string;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseInputClasses =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    name,
    value,
    checked,
    onChange,
    placeholder,
    disabled = false,
    ...rest
  } = props;

  const inputId = id || `input-${Math.random().toString(36).slice(2, 10)}`;

  // Campos especiales
  if (type === "checkbox" || type === "radio") {
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type as any}
          className="h-4 w-4 accent-primary"
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          {...(rest as any)}
        />
        <span className="text-sm">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
      </label>
    );
  }

  // Input estándar
  return (
    <div className={cn("grid gap-1", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type as any}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(baseInputClasses, error && "border-destructive")}
        {...(rest as any)}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
