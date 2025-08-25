import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import PriceInput from '../../../components/PriceInput';

const InventoryDataSection = ({ register, errors, watch, setValue }) => {
  // Valor controlado por react-hook-form
  const price = watch('price') || '';

  // Reglas de validación para el precio (DECIMAL "xxxxx.00")
  const priceRules = {
    required: 'El precio es obligatorio',
    validate: (v) =>
      !v || /^\d+\.\d{2}$/.test(v) || 'Formato inválido (use números, p.ej. 11990.00)',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-foreground mb-6">
        Información de Inventario
      </h3>

      <div className="space-y-6">
        {/* PRECIO (CLP) */}
        <div className="space-y-2">
          <PriceInput
            label="Precio (CLP)"
            value={price} // viene como "11990.00"
            onChange={(decimal) => {
              // Escribimos en react-hook-form y disparamos validación
              setValue('price', decimal, { shouldValidate: true, shouldDirty: true });
            }}
            error={errors?.price?.message}
          />
          {/* Mantener un input oculto para que react-hook-form siga registrando/validando el campo */}
          <input
            type="hidden"
            {...register('price', priceRules)}
            value={price}
            readOnly
          />
          <p className="text-sm text-muted-foreground">
            Ingrese el precio en CLP (se mostrará con separadores; se enviará al backend como <code>xxxxx.00</code>).
          </p>
        </div>

        {/* DISPONIBILIDAD */}
        <div className="space-y-2">
          <Checkbox
            label="Disponible para préstamo"
            {...register('available')}
          />
          <p className="text-sm text-muted-foreground">
            Marque esta casilla si el libro está disponible para ser prestado
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryDataSection;
