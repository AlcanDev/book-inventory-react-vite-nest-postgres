import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useDebounce } from '../../hooks/useDebounce';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import ResultsHeader from './components/ResultsHeader';
import BookCard from './components/BookCard';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search and filter state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [filters, setFilters] = useState({
    genre: searchParams?.get('genre') || '',
    publisher: searchParams?.get('publisher') || '',
    author: searchParams?.get('author') || '',
    available: searchParams?.get('available') || ''
  });

  // Pagination and sorting
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams?.get('page')) || 1,
    limit: parseInt(searchParams?.get('limit')) || 12,
    total: 0,
    totalPages: 0
  });

  const [sorting, setSorting] = useState({
    field: searchParams?.get('sortField') || 'title',
    direction: searchParams?.get('sortDirection') || 'asc'
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params?.set('q', debouncedSearchQuery);
    if (filters?.genre) params?.set('genre', filters?.genre);
    if (filters?.publisher) params?.set('publisher', filters?.publisher);
    if (filters?.author) params?.set('author', filters?.author);
    if (filters?.available) params?.set('available', filters?.available);
    if (pagination?.page > 1) params?.set('page', pagination?.page?.toString());
    if (pagination?.limit !== 12) params?.set('limit', pagination?.limit?.toString());
    if (sorting?.field !== 'title') params?.set('sortField', sorting?.field);
    if (sorting?.direction !== 'asc') params?.set('sortDirection', sorting?.direction);

    setSearchParams(params);
  }, [debouncedSearchQuery, filters, pagination?.page, pagination?.limit, sorting, setSearchParams]);

  // Fetch books function
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        q: debouncedSearchQuery,
        ...filters,
        page: pagination?.page,
        limit: pagination?.limit,
        sort: `${sorting?.field}:${sorting?.direction}`
      };

      // Remove empty filters
      Object.keys(params)?.forEach(key => {
        if (params?.[key] === '' || params?.[key] === undefined) {
          delete params?.[key];
        }
      });

      const response = await bookService?.getBooks(params);

      if (response?.data) {
        setBooks(response?.data?.items || []);
        setPagination(prev => ({
          ...prev,
          total: response?.data?.total || 0,
          totalPages: Math.ceil((response?.data?.total || 0) / prev?.limit)
        }));
      }
    } catch (err) {
      setError('Error al cargar los resultados. Por favor, inténtelo de nuevo.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchBooks();
  }, [debouncedSearchQuery, filters, pagination?.page, pagination?.limit, sorting]);

  // Reset page when search/filters change
  useEffect(() => {
    if (pagination?.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearchQuery, filters?.genre, filters?.publisher, filters?.author, filters?.available]);

  // Event handlers
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (field, direction) => {
    setSorting({ field, direction });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      genre: '',
      publisher: '',
      author: '',
      available: ''
    });
  };

  const handleBookView = (id) => {
    navigate(`/book/${id}`);
  };

  const handleBookEdit = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const hasActiveFilters = searchQuery || Object.values(filters)?.some(value => value !== '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Búsqueda de Libros</h1>
          <p className="text-muted-foreground">
            Encuentra libros con filtros avanzados y búsqueda en tiempo real
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={() => setSearchQuery('')}
        />

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onClearAll={clearAllFilters}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Results Header and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <ResultsHeader
            totalResults={pagination?.total}
            searchQuery={debouncedSearchQuery}
            hasActiveFilters={hasActiveFilters}
          />
          
          <SortControls
            sorting={sorting}
            onChange={handleSortChange}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">Buscando libros...</span>
          </div>
        )}

        {/* Results Grid */}
        {!loading && books?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books?.map((book) => (
              <BookCard
                key={book?.id}
                book={book}
                onView={handleBookView}
                onEdit={handleBookEdit}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && books?.length === 0 && (
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        )}

        {/* Pagination */}
        {!loading && books?.length > 0 && pagination?.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;