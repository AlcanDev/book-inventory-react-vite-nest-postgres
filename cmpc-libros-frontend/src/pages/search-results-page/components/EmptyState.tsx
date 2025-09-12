import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasActiveFilters, onClearFilters }: any) => {
  return (
    <div className="text-center py-12 bg-card border border-border rounded-lg">
      <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-6" />
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasActiveFilters ? 'No se encontraron resultados' : 'Comienza tu búsqueda'}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {hasActiveFilters 
          ? 'No hay libros que coincidan con los criterios de búsqueda. Intenta modificar los filtros o realizar una búsqueda diferente.'
          : 'Utiliza la barra de búsqueda o los filtros para encontrar los libros que necesitas.'
        }
      </p>
      
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Limpiar todos los filtros
        </Button>
      )}
    </div>
  );
};

export default EmptyState;