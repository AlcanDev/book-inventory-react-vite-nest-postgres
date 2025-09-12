import React from "react";
import { decimalStringToCLPInt, formatCLP, parseCLPToDecimalString } from "utils/currency";
import Input from "./ui/Input";

type PriceInputProps = {
  /** Valor controlado en formato DECIMAL "xxxxx.00" (ej: "11990.00") */
  value: string;
  /** Devuelve el valor en formato DECIMAL "xxxxx.00" */
  onChange: (decimal: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  id?: string;
  name?: string;
  /** Si true, formatea mientras se escribe (puede mover el caret). Default: false (formatea en blur). */
  formatOnChange?: boolean;
};

/**
 * Input de precio CLP.
 * - Muestra al usuario CLP formateado (ej: $ 11.990)
 * - Propaga al padre un string DECIMAL ("11990.00")
 */
const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  label = "Precio (CLP)",
  placeholder = "$ 0",
  disabled = false,
  error,
  id = "price",
  name = "price",
  formatOnChange = false,
}) => {
  const [display, setDisplay] = React.useState<string>("");

  // Sincroniza el display cuando cambia el value externo
  React.useEffect(() => {
    const clpInt = decimalStringToCLPInt(value); // "11990.00" -> 11990
    setDisplay(value ? formatCLP(clpInt) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Calculamos el DECIMAL a partir de lo que escribe el usuario
    const decimal = parseCLPToDecimalString(raw);
    onChange(decimal);

    if (formatOnChange) {
      // Mostrar formateado mientras se escribe (puede saltar caret)
      const clpInt = decimalStringToCLPInt(decimal);
      setDisplay(decimal ? formatCLP(clpInt) : "");
    } else {
      // Mostrar lo que escribe el usuario sin formatear
      setDisplay(raw);
    }
  };

  const handleBlur = () => {
    // Al salir, siempre dejamos formateado
    const clpInt = decimalStringToCLPInt(value);
    setDisplay(value ? formatCLP(clpInt) : "");
  };

  const handleClear = () => {
    onChange("");
    setDisplay("");
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-end gap-2">
        <div className="grow">
          <Input
            id={id}
            name={name}
            type="text"
            inputMode="numeric"
            pattern="[0-9\s\.\$]*"
            label={label}
            placeholder={placeholder}
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            error={error}
          />
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="h-10 px-3 rounded-md border border-input text-sm hover:bg-accent disabled:opacity-50"
          disabled={disabled || !display}
          aria-label="Limpiar precio"
          title="Limpiar precio"
        >
          Limpiar
        </button>
      </div>

      
    </div>
  );
};

export default PriceInput;
