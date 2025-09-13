import React from 'react';
import Icon from '../../../components/AppIcon';

const BookImageSection = ({ book }: any) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
        {book?.imageUrl ? (
          <img
            src={book.imageUrl.startsWith('http') ? book.imageUrl : `http://localhost:3000${book.imageUrl}`}
            alt={book?.title}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Book" size={64} className="text-muted-foreground" />
          </div>
        )}
        {/* Fallback for broken images */}
        <div className="w-full h-full hidden items-center justify-center">
          <Icon name="Book" size={64} className="text-muted-foreground" />
        </div>
      </div>

      {/* Availability Status */}
      <div className="text-center">
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
          book?.available 
            ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
        }`}>
          {book?.available ? 'Disponible' : 'No disponible'}
        </span>
      </div>
    </div>
  );
};

export default BookImageSection;