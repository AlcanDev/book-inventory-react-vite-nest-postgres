import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PaginationControls = ({ pagination, onPageChange, onLimitChange }) => {
  const { page, limit, total, totalPages } = pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers?.push(i);
    }
    
    return pageNumbers;
  };

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card border border-border rounded-lg p-4">
      {/* Results info and items per page */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {total} resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            name="limit"
            value={limit?.toString()}
            onChange={(e) => onLimitChange(parseInt(e?.target?.value))}
            options={[
              { value: '10', label: '10' },
              { value: '25', label: '25' },
              { value: '50', label: '50' },
              { value: '100', label: '100' }
            ]}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">por página</span>
        </div>
      </div>
      {/* Pagination buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          iconName="ChevronsLeft"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          iconName="ChevronLeft"
        />

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {generatePageNumbers()?.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="min-w-[2.5rem]"
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          iconName="ChevronRight"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          iconName="ChevronsRight"
        />
      </div>
    </div>
  );
};

export default PaginationControls;