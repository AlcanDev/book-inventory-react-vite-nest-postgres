import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onChange, onClearAll }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e?.target;
    onChange({ [name]: value });
  };

  const hasActiveFilters = Object.values(filters)?.some((value: any) => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filter Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">Filtros Avanzados</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                {Object.values(filters)?.filter((value: any) => value !== '')?.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                iconName="X"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Limpiar filtros
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="left"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'} filtros
            </Button>
          </div>
        </div>
      </div>
      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Género"
              type="text"
              name="genre"
              placeholder="Ej: Fantasía, Romance..."
              value={filters?.genre || ''}
              onChange={handleInputChange}
            />

            <Input
              label="Editorial"
              type="text"
              name="publisher"
              placeholder="Ej: Planeta, Alfaguara..."
              value={filters?.publisher || ''}
              onChange={handleInputChange}
            />

            <Input
              label="Autor"
              type="text"
              name="author"
              placeholder="Ej: García Márquez..."
              value={filters?.author || ''}
              onChange={handleInputChange}
            />

            <Select
              label="Disponibilidad"
              name="available"
              value={filters?.available || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Todos' },
                { value: 'true', label: 'Disponible' },
                { value: 'false', label: 'No disponible' }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;