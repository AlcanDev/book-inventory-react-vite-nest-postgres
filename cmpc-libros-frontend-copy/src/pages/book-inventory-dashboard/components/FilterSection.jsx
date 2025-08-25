import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterSection = ({ filters, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    onChange({ [name]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Filtros de Búsqueda</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Input
          label="Búsqueda"
          type="text"
          name="q"
          placeholder="Buscar por título, autor, editorial..."
          value={filters?.q || ''}
          onChange={handleInputChange}
        />

        <Input
          label="Género"
          type="text"
          name="genre"
          placeholder="Filtrar por género"
          value={filters?.genre || ''}
          onChange={handleInputChange}
        />

        <Input
          label="Editorial"
          type="text"
          name="publisher"
          placeholder="Filtrar por editorial"
          value={filters?.publisher || ''}
          onChange={handleInputChange}
        />

        <Input
          label="Autor"
          type="text"
          name="author"
          placeholder="Filtrar por autor"
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
  );
};

export default FilterSection;