import React from 'react';
import Input from '../../../components/ui/Input';

const BasicInformationSection = ({ register, errors, watch }: any) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-foreground mb-6">
        Información Básica
      </h3>
      
      <div className="space-y-6">
        <Input
          label="Título del Libro"
          type="text"
          placeholder="Ingrese el título del libro"
          {...register('title', {
            required: 'El título es obligatorio',
            minLength: {
              value: 2,
              message: 'El título debe tener al menos 2 caracteres'
            },
            maxLength: {
              value: 200,
              message: 'El título no puede superar los 200 caracteres'
            }
          })}
          error={errors?.title?.message}
          required
        />

        <Input
          label="Autor"
          type="text"
          placeholder="Ingrese el nombre del autor"
          {...register('author', {
            required: 'El autor es obligatorio',
            minLength: {
              value: 2,
              message: 'El nombre del autor debe tener al menos 2 caracteres'
            },
            maxLength: {
              value: 100,
              message: 'El nombre del autor no puede superar los 100 caracteres'
            }
          })}
          error={errors?.author?.message}
          required
        />

        <Input
          label="Género"
          type="text"
          placeholder="Ej: Ficción, Romance, Ciencia Ficción"
          {...register('genre', {
            required: 'El género es obligatorio',
            minLength: {
              value: 2,
              message: 'El género debe tener al menos 2 caracteres'
            },
            maxLength: {
              value: 50,
              message: 'El género no puede superar los 50 caracteres'
            }
          })}
          error={errors?.genre?.message}
          required
        />
      </div>
    </div>
  );
};

export default BasicInformationSection;