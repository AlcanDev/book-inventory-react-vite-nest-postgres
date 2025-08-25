import React from 'react';
import Select from '../../../components/ui/Select';

const SortControls = ({ sorting, onChange }) => {
  const sortOptions = [
    { value: 'title:asc', label: 'Título (A-Z)' },
    { value: 'title:desc', label: 'Título (Z-A)' },
    { value: 'author:asc', label: 'Autor (A-Z)' },
    { value: 'author:desc', label: 'Autor (Z-A)' },
    { value: 'price:asc', label: 'Precio (Menor a Mayor)' },
    { value: 'price:desc', label: 'Precio (Mayor a Menor)' },
    { value: 'publisher:asc', label: 'Editorial (A-Z)' },
    { value: 'publisher:desc', label: 'Editorial (Z-A)' },
  ];

  const handleSortChange = (e) => {
    const [field, direction] = e?.target?.value?.split(':');
    onChange(field, direction);
  };

  const currentValue = `${sorting?.field}:${sorting?.direction}`;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground">Ordenar por:</span>
      <Select
        name="sort"
        value={currentValue}
        onChange={handleSortChange}
        options={sortOptions}
        className="min-w-[200px]"
      />
    </div>
  );
};

export default SortControls;