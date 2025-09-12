import React from 'react';
import Button from '../../../components/ui/Button';

const Pagination = ({ pagination, onPageChange }: any) => {
  const { page, totalPages } = pagination;

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

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 bg-card border border-border rounded-lg p-4">
      {/* First page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        iconName="ChevronsLeft"
        className="hidden sm:flex"
      />
      {/* Previous page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        iconName="ChevronLeft"
      />
      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {generatePageNumbers()?.map((pageNum: any) => (
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
      {/* Next page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        iconName="ChevronRight"
      />
      {/* Last page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        iconName="ChevronsRight"
        className="hidden sm:flex"
      />
    </div>
  );
};

export default Pagination;