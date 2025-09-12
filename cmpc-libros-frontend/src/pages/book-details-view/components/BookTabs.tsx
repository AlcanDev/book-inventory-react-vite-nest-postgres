import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { formatCLP } from '../../../utils/currency';

const BookTabs = ({ book }: any) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Detalles', icon: 'Info' },
    { id: 'history', label: 'Historial', icon: 'Clock' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información Detallada</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Información del Libro</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Título:</span>
                    <span className="text-foreground">{book?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Autor:</span>
                    <span className="text-foreground">{book?.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Editorial:</span>
                    <span className="text-foreground">{book?.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Género:</span>
                    <span className="text-foreground">{book?.genre}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Información de Inventario</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="text-foreground">
                      {formatCLP(Number(String(book?.price || '0').split('.')[0]))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disponibilidad:</span>
                    <span className={`${book?.available ? 'text-green-600' : 'text-red-600'}`}>
                      {book?.available ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="text-foreground font-mono text-xs">{book?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Historial del Libro</h3>
            <div className="space-y-3">
              {book?.createdAt && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Libro registrado</p>
                    <p className="text-sm text-muted-foreground">
                      El libro fue agregado al inventario
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(book?.createdAt)?.toLocaleDateString()}
                  </span>
                </div>
              )}

              {book?.updatedAt && book?.updatedAt !== book?.createdAt && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Última actualización</p>
                    <p className="text-sm text-muted-foreground">
                      Los datos del libro fueron modificados
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(book?.updatedAt)?.toLocaleDateString()}
                  </span>
                </div>
              )}

              {(!book?.createdAt && !book?.updatedAt) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay historial disponible para este libro</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs?.map((tab: any) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              iconName={tab?.icon}
              iconPosition="left"
              className={`rounded-none border-0 ${
                activeTab === tab?.id 
                  ? 'border-b-2 border-primary' :''
              }`}
            >
              {tab?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookTabs;