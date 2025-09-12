import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "../../../components/ui/Checkbox";
import PriceInput from "../../../components/PriceInput";

type Props = {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  control: any;          // 👈 AÑADIDO: para usar Controller
  disabled?: boolean;
};

const InventoryDataSection: React.FC<Props> = ({
  register,
  errors,
  watch,
  setValue,
  control,               // 👈
  disabled = false,
}) => {
  // Valor controlado por react-hook-form (DECIMAL "xxxxx.00")
  const price: string = watch("price") || "";

  // Reglas de validación para DECIMAL "xxxxx.00"
  const priceRules = {
    required: "El precio es obligatorio",
    validate: (v: string) =>
      !v || /^\d+\.\d{2}$/.test(v) || "Formato inválido (use 11990.00)",
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 grid gap-6">
      <h3 className="text-lg font-medium text-foreground">Información de Inventario</h3>

      {/* PRECIO */}
      <div className="grid gap-2">
        <PriceInput
          value={price} // "xxxxx.00"
          onChange={(decimal) =>
            setValue("price", decimal, { shouldValidate: true, shouldDirty: true })
          }
          error={errors?.price?.message}
          disabled={disabled}
          // formatOnChange
        />

        {/* Input oculto para que react-hook-form registre/valide el campo */}
        <input
          type="hidden"
          {...register("price", priceRules)}
          value={price}
          readOnly
        />
      </div>

      {/* DISPONIBILIDAD */}
      <div className="grid gap-1">
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="available"
              label="Disponible"
              // RHF nos da el valor actual en field.value
              checked={!!field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.checked)
              }
              onBlur={field.onBlur}
              disabled={disabled}
            />
          )}
        />
        <p className="text-sm text-muted-foreground">
          Marque esta casilla si el libro está disponible.
        </p>
      </div>
    </section>
  );
};

export default InventoryDataSection;
