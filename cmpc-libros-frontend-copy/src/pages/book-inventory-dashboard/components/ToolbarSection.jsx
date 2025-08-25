import React from 'react';
import Button from '../../../components/ui/Button';


const ToolbarSection = ({ 
  selectedCount, 
  totalCount, 
  onAddNew, 
  onExport, 
  onDeleteSelected 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0 ? (
            <span>{selectedCount} de {totalCount} libros seleccionados</span>
          ) : (
            <span>{totalCount} libros encontrados</span>
          )}
        </div>
        
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            iconName="Trash2"
            iconPosition="left"
          >
            Eliminar Seleccionados ({selectedCount})
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          iconName="Download"
          iconPosition="left"
        >
          Exportar CSV
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onAddNew}
          iconName="Plus"
          iconPosition="left"
        >
          Agregar Libro
        </Button>
      </div>
    </div>
  );
};

export default ToolbarSection;