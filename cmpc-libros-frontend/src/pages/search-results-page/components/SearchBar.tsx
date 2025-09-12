import React from 'react';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ value, onChange, onClear }: any) => {
  const handleInputChange = (e: any) => {
    onChange(e?.target?.value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Buscar por título, autor, editorial, género..."
              value={value}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        {value && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            iconName="X"
            iconPosition="left"
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;