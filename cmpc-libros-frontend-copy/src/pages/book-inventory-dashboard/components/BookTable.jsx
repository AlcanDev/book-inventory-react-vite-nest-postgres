import React from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { formatCLP } from '../../../utils/currency';

const BookTable = ({ 
  books, 
  loading, 
  selectedBooks, 
  onSelectionChange, 
  onSort, 
  sorting, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(books?.map(book => book?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectBook = (bookId, checked) => {
    if (checked) {
      onSelectionChange([...selectedBooks, bookId]);
    } else {
      onSelectionChange(selectedBooks?.filter(id => id !== bookId));
    }
  };

  const getSortIcon = (field) => {
    if (sorting?.field !== field) return 'ArrowUpDown';
    return sorting?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          <span className="text-muted-foreground">Cargando libros...</span>
        </div>
      </div>
    );
  }
  if (!books || books?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <Icon name="Book" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron libros</h3>
          <p className="text-muted-foreground">
            No hay libros que coincidan con los filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Checkbox
                  checked={selectedBooks?.length === books?.length && books?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => onSort('title')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Título</span>
                  <Icon name={getSortIcon('title')} size={12} />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => onSort('author')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Autor</span>
                  <Icon name={getSortIcon('author')} size={12} />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => onSort('publisher')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Editorial</span>
                  <Icon name={getSortIcon('publisher')} size={12} />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => onSort('genre')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Género</span>
                  <Icon name={getSortIcon('genre')} size={12} />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => onSort('price')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Precio</span>
                  <Icon name={getSortIcon('price')} size={12} />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Disponibilidad
              </th>
              
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-card divide-y divide-border">
            {books?.map((book) => (
              <tr key={book?.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedBooks?.includes(book?.id)}
                    onChange={(e) => handleSelectBook(book?.id, e?.target?.checked)}
                  />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {book?.imageUrl && (
                      <img
                        src={book?.imageUrl}
                        alt={book?.title}
                        className="h-10 w-8 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {book?.title}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {book?.author}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {book?.publisher}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {book?.genre}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatCLP(Number(String(book?.price || '0').split('.')[0]))}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    book?.available 
                      ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                  }`}>
                    {book?.available ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(book?.id)}
                      iconName="Eye"
                      className="text-blue-600 hover:text-blue-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(book?.id)}
                      iconName="Edit"
                      className="text-green-600 hover:text-green-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(book?.id)}
                      iconName="Trash2"
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;