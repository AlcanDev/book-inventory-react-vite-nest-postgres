import React, { useState } from "react";
import { ChevronDown, X, Search, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";
import Input from "./Input";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  className?: string;
  options?: SelectOption[];
  value?: any;
  defaultValue?: any;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  id?: string;
  name?: string;
  onChange?: (val: any) => void;
  onOpenChange?: (open: boolean) => void;
};

const Select = React.forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const {
    className,
    options = [],
    value,
    defaultValue,
    placeholder = "Selecciona una opción",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    ...rest
  } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues: string[] = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (value ? [value] : []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleSelect = (v: string) => {
    if (multiple) {
      const set = new Set(selectedValues);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      onChange?.(Array.from(set));
    } else {
      onChange?.(v);
      setOpen(false);
      onOpenChange?.(false);
    }
  };

  const clear = () => {
    onChange?.(multiple ? [] : "");
  };

  const labelFromValue = (v: string) =>
    options.find((o) => o.value === v)?.label ?? v;

  const filtered = searchable
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div className={cn("grid gap-1", className)} {...(rest as any)}>
      {label && (
        <label className="text-sm text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <Button
          ref={ref as any}
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between",
            error && "border-destructive"
          )}
          onClick={toggleOpen}
          iconName="ChevronDown"
          iconPosition="right"
          disabled={disabled || loading}
        >
          {selectedValues.length > 0
            ? (multiple
                ? selectedValues.map(labelFromValue).join(", ")
                : labelFromValue(selectedValues[0]))
            : placeholder}
        </Button>

        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-2 shadow">
            {searchable && (
              <div className="mb-2">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e: any) => setSearch(e?.target?.value)}
                />
              </div>
            )}

            <ul className="max-h-56 overflow-auto">
              {filtered.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={16} />}
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-2 py-1.5 text-sm text-muted-foreground">
                  Sin resultados
                </li>
              )}
            </ul>

            {clearable && (
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clear} iconName="X">
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
