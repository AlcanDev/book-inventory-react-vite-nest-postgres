import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Checkbox individual
 */
export type CheckboxProps = {
  className?: string;
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  onChange?: (e: any) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {
      className,
      id,
      checked = false,
      indeterminate = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      size = "default",
      onChange,
      ...rest
    } = props;

    // Evita el estrechamiento de tipo literal que causa TS2367
    const sizeKey = (size as any) || "default";
    const boxSize =
      sizeKey === "sm" ? "h-4 w-4" : sizeKey === "lg" ? "h-6 w-6" : "h-5 w-5";
    const iconPx = sizeKey === "lg" ? 18 : sizeKey === "sm" ? 12 : 14;

    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 10)}`;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded border transition-colors",
            boxSize,
            checked || indeterminate
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input"
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            required={required}
            disabled={disabled}
            onChange={onChange}
            {...(rest as any)}
          />
          {checked && !indeterminate && <Check size={iconPx} />}
          {indeterminate && <Minus size={iconPx} />}
        </span>

        {(label || description || error) && (
          <span className="grid leading-tight">
            {label && (
              <span className="text-sm text-foreground">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
            {error && (
              <span className="text-xs text-destructive mt-1">{error}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

/**
 * Grupo de checkboxes (opcional)
 */
export type CheckboxGroupProps = {
  className?: string;
  children?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
};

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props, ref) => {
    const {
      className,
      children,
      label,
      description,
      error,
      required = false,
      disabled = false,
      ...rest
    } = props;

    return (
      <div
        ref={ref}
        className={cn("grid gap-1", disabled && "opacity-60", className)}
        {...(rest as any)}
      >
        {label && (
          <span className="text-sm text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </span>
        )}
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
        <div className="flex flex-wrap gap-3">{children}</div>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

export default Checkbox;
