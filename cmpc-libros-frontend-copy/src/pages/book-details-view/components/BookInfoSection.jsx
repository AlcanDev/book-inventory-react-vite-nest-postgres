import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCLP } from '../../../utils/currency';

const BookInfoSection = ({ book }) => {
  const infoItems = [
    { label: 'Autor', value: book?.author, icon: 'User' },
    { label: 'Editorial', value: book?.publisher, icon: 'Building' },
    { label: 'Género', value: book?.genre, icon: 'Tag' },
    { label: 'Precio', value: formatCLP(Number(String(book?.price || '0').split('.')[0])), icon: 'DollarSign' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {book?.title}
          </h1>
        </div>

        {/* Book Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems?.map((item) => (
            <div key={item?.label} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name={item?.icon} size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item?.label}
                </p>
                <p className="text-foreground">
                  {item?.value || 'No especificado'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Información Adicional
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ID del Libro:</span>
              <span className="text-foreground font-mono text-sm">{book?.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado:</span>
              <span className={`font-semibold ${
                book?.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {book?.available ? 'Disponible para préstamo' : 'No disponible'}
              </span>
            </div>

            {book?.createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Fecha de registro:</span>
                <span className="text-foreground">
                  {new Date(book?.createdAt)?.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoSection;