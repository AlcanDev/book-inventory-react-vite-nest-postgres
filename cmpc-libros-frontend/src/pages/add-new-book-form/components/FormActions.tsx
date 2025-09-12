import React from 'react';
import Button from '../../../components/ui/Button';

const FormActions = ({ isEdit, loading, onCancel }: any) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          iconName="X"
          iconPosition="left"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="default"
          loading={loading}
          disabled={loading}
          iconName={loading ? undefined : (isEdit ? "Save" : "Plus")}
          iconPosition="left"
        >
          {loading 
            ? (isEdit ? 'Actualizando...' : 'Guardando...') 
            : (isEdit ? 'Actualizar Libro' : 'Agregar Libro')
          }
        </Button>
      </div>
    </div>
  );
};

export default FormActions;