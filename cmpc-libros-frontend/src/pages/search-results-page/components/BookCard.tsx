import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { formatCLP } from '../../../utils/currency';

const BookCard = ({ book, onView, onEdit }: any) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Book Image */}
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {book?.imageUrl ? (
          <img
            src={book?.imageUrl}
            alt={book?.title}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Book" size={48} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Fallback for broken images */}
        <div className="w-full h-full hidden items-center justify-center absolute inset-0 bg-muted">
          <Icon name="Book" size={48} className="text-muted-foreground" />
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            book?.available 
              ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
          }`}>
            {book?.available ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>
      {/* Book Content */}
      <div className="p-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {book?.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-muted-foreground">
            por {book?.author}
          </p>

          {/* Publisher and Genre */}
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <span>{book?.publisher}</span>
            <span>•</span>
            <span>{book?.genre}</span>
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-primary">
            {formatCLP(Number(String(book?.price || '0').split('.')[0]))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(book?.id)}
            iconName="Eye"
            iconPosition="left"
          >
            Ver Detalles
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(book?.id)}
            iconName="Edit"
            className="text-muted-foreground hover:text-foreground"
          >
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;