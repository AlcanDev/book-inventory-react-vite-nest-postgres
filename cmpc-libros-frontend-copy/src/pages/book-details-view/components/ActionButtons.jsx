import React from 'react';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ onEdit, onDelete, onBackToInventory }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border rounded-lg p-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Detalles del Libro</h2>
        <p className="text-muted-foreground">
          Información completa del libro seleccionado
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToInventory}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Volver al Inventario
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          iconName="Edit"
          iconPosition="left"
        >
          Editar
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          iconName="Trash2"
          iconPosition="left"
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;