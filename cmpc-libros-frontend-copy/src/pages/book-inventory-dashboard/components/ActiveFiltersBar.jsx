import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActiveFiltersBar = ({ filters, onClearFilter, onClearAll }) => {
  const getFilterDisplayName = (key) => {
    const displayNames = {
      q: 'Búsqueda',
      genre: 'Género',
      publisher: 'Editorial', 
      author: 'Autor',
      available: 'Disponibilidad'
    };
    return displayNames?.[key] || key;
  };

  const getFilterDisplayValue = (key, value) => {
    if (key === 'available') {
      return value === 'true' ? 'Disponible' : 'No disponible';
    }
    return value;
  };

  const activeFilters = Object.entries(filters)?.filter(([key, value]) => value !== '');

  if (activeFilters?.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
      
      {activeFilters?.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
        >
          <span className="mr-2">
            {getFilterDisplayName(key)}: {getFilterDisplayValue(key, value)}
          </span>
          <button
            onClick={() => onClearFilter({ [key]: '' })}
            className="hover:bg-primary/80 rounded-full p-1"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-muted-foreground hover:text-foreground"
        iconName="X"
        iconPosition="left"
      >
        Limpiar todos
      </Button>
    </div>
  );
};

export default ActiveFiltersBar;