import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useDebounce } from '../../hooks/useDebounce';
import FilterSection from './components/FilterSection';
import ToolbarSection from './components/ToolbarSection';
import ActiveFiltersBar from './components/ActiveFiltersBar';
import BookTable from './components/BookTable';
import PaginationControls from './components/PaginationControls';

const BookInventoryDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  
  // Filter and search state
  const [filters, setFilters] = useState({
    q: '',
    genre: '',
    publisher: '',
    author: '',
    available: ''
  });
  
  // Pagination and sorting
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [sorting, setSorting] = useState({
    field: 'title',
    direction: 'asc'
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(filters?.q, 500);

  // Fetch books function
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, unknown> = {
        ...filters,
        q: debouncedSearchQuery,
        page: pagination?.page,
        limit: pagination?.limit,
        sort: `${sorting?.field}:${sorting?.direction}`,
      };
      // Normalize availability: only include when 'true' or 'false'
      if (params.available !== 'true' && params.available !== 'false') {
        delete params.available;
      }
      // Remove empty values
      Object.keys(params).forEach((key) => {
        const v = params[key];
        if (v === '' || v === undefined || v === null) {
          delete params[key];
        }
      });

      const response = await bookService?.getBooks(params);
      
      if (response?.data) {
        setBooks(response?.data?.items || []);
        setPagination((prev: any) => ({
          ...prev,
          total: response?.data?.total || 0,
          totalPages: Math.ceil((response?.data?.total || 0) / prev?.limit)
        }));
      }
    } catch (err) {
      setError('Error al cargar los libros. Por favor, inténtelo de nuevo.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchBooks();
  }, [debouncedSearchQuery, pagination?.page, pagination?.limit, sorting, filters?.genre, filters?.publisher, filters?.author, filters?.available]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev: any) => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery, filters?.genre, filters?.publisher, filters?.author, filters?.available]);

  // Event handlers
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (field: any) => {
    setSorting((prev: any) => ({
      field,
      direction: prev?.field === field && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: any) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: any) => {
    setPagination((prev: any) => ({ ...prev, limit, page: 1 }));
  };

  const handleSelectionChange = (bookIds: any) => {
    setSelectedBooks(bookIds);
  };

  const handleExport = async () => {
    try {
      const params: Record<string, unknown> = { ...filters, q: debouncedSearchQuery };
      if (params.available !== 'true' && params.available !== 'false') {
        delete params.available;
      }
      Object.keys(params).forEach((key) => {
        const v = params[key];
        if (v === '' || v === undefined || v === null) {
          delete params[key];
        }
      });

      const blob = await bookService?.exportBooks(params);
      
      // Create download link
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `libros_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting books:', err);
      setError('Error al exportar los libros. Por favor, inténtelo de nuevo.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks?.length === 0) return;
    
    if (window.confirm(`¿Está seguro de que desea eliminar ${selectedBooks?.length} libro(s)?`)) {
      try {
        await Promise.all(
          selectedBooks?.map((id: any) => bookService?.deleteBook(id))
        );
        setSelectedBooks([]);
        fetchBooks(); // Refresh the list
      } catch (err) {
        console.error('Error deleting books:', err);
        setError('Error al eliminar los libros. Por favor, inténtelo de nuevo.');
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      genre: '',
      publisher: '',
      author: '',
      available: ''
    });
  };

  const activeFiltersCount = Object.values(filters)?.filter((value: any) => value !== '')?.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario de Libros</h1>
          <p className="text-muted-foreground">
            Gestiona tu colección de libros con filtros avanzados y búsqueda en tiempo real
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <FilterSection
          filters={filters}
          onChange={handleFilterChange}
        />

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <ActiveFiltersBar
            filters={filters}
            onClearFilter={handleFilterChange}
            onClearAll={clearFilters}
          />
        )}

        {/* Toolbar */}
        <ToolbarSection
          selectedCount={selectedBooks?.length}
          totalCount={pagination?.total}
          onAddNew={() => navigate('/add-book')}
          onExport={handleExport}
          onDeleteSelected={handleDeleteSelected}
        />

        {/* Book Table */}
        <BookTable
          books={books}
          loading={loading}
          selectedBooks={selectedBooks}
          onSelectionChange={handleSelectionChange}
          onSort={handleSortChange}
          sorting={sorting}
          onView={(id: any) => navigate(`/book/${id}`)}
          onEdit={(id: any) => navigate(`/edit-book/${id}`)}
          onDelete={async (id: any) => {
            if (window.confirm('¿Está seguro de que desea eliminar este libro?')) {
              try {
                await bookService?.deleteBook(id);
                fetchBooks();
              } catch (err) {
                console.error('Error deleting book:', err);
                setError('Error al eliminar el libro.');
              }
            }
          }}
        />

        {/* Pagination */}
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
};

export default BookInventoryDashboard;