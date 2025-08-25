import React from 'react';
import Icon from '../../../components/AppIcon';

const ResultsHeader = ({ totalResults, searchQuery, hasActiveFilters }) => {
  return (
    <div className="flex items-center space-x-2">
      <Icon name="BookOpen" size={20} className="text-muted-foreground" />
      
      <div className="text-sm text-muted-foreground">
        {totalResults === 0 ? (
          <span>No se encontraron resultados</span>
        ) : (
          <span>
            {totalResults} {totalResults === 1 ? 'libro encontrado' : 'libros encontrados'}
          </span>
        )}
        
        {searchQuery && (
          <span> para "{searchQuery}"</span>
        )}
        
        {hasActiveFilters && !searchQuery && (
          <span> con los filtros aplicados</span>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;