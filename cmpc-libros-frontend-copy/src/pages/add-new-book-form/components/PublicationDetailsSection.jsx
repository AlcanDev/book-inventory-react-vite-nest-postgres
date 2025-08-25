import React from 'react';
import Input from '../../../components/ui/Input';

const PublicationDetailsSection = ({ register, errors, watch }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-foreground mb-6">
        Detalles de Publicación
      </h3>
      
      <div className="space-y-6">
        <Input
          label="Editorial"
          type="text"
          placeholder="Ingrese el nombre de la editorial"
          {...register('publisher', {
            required: 'La editorial es obligatoria',
            minLength: {
              value: 2,
              message: 'El nombre de la editorial debe tener al menos 2 caracteres'
            },
            maxLength: {
              value: 100,
              message: 'El nombre de la editorial no puede superar los 100 caracteres'
            }
          })}
          error={errors?.publisher?.message}
          required
        />
      </div>
    </div>
  );
};

export default PublicationDetailsSection;