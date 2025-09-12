import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import BookImageSection from './components/BookImageSection';
import BookInfoSection from './components/BookInfoSection';
import ActionButtons from './components/ActionButtons';
import BookTabs from './components/BookTabs';

const BookDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookService?.getBook(bookId);
      
      if (response?.data) {
        setBook(response?.data);
      } else {
        setError('No se encontraron datos del libro');
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Error al cargar los detalles del libro');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-book/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este libro?')) {
      try {
        await bookService?.deleteBook(id);
        navigate('/inventory');
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Error al eliminar el libro');
      }
    }
  };

  const handleBackToInventory = () => {
    navigate('/inventory');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          <span className="text-muted-foreground">Cargando detalles del libro...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">Libro no encontrado</h3>
          <p className="text-muted-foreground">
            No se pudo encontrar el libro solicitado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Action Buttons */}
        <ActionButtons
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBackToInventory={handleBackToInventory}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <BookImageSection book={book} />
          </div>

          {/* Right Column - Book Info */}
          <div className="lg:col-span-2">
            <BookInfoSection book={book} />
          </div>
        </div>

        {/* Tabs Section */}
        <BookTabs book={book} />
      </div>
    </div>
  );
};

export default BookDetailsView;