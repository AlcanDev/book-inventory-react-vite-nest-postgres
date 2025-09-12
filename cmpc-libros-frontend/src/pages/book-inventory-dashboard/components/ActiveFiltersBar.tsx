import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

interface Filters {
  readonly q?: string;
  readonly genre?: string;
  readonly publisher?: string;
  readonly author?: string;
  readonly available?: '' | 'true' | 'false';
}

interface ActiveFiltersBarProps {
  readonly filters: Filters;
  readonly onClearFilter: (partial: Partial<Filters>) => void;
  readonly onClearAll: () => void;
}

/**
 * Displays currently active filters as tags with the ability to clear them individually or all at once.
 */
const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({ filters, onClearFilter, onClearAll }) => {
  const getFilterDisplayName = (key: keyof Filters | string): string => {
    const displayNames: Record<string, string> = {
      q: 'Búsqueda',
      genre: 'Género',
      publisher: 'Editorial',
      author: 'Autor',
      available: 'Disponibilidad',
    } as const;
    return displayNames[key as string] ?? (key as string);
  };

  const getFilterDisplayValue = (key: keyof Filters | string, value: string): string => {
    if (key === 'available') {
      return value === 'true' ? 'Disponible' : 'No disponible';
    }
    return value;
  };

  const activeFilters = Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined && value !== null);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
      
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
        >
          <span className="mr-2">
            {getFilterDisplayName(key)}: {getFilterDisplayValue(key, String(value))}
          </span>
          <button
            onClick={() => onClearFilter({ [key]: '' } as Partial<Filters>)}
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