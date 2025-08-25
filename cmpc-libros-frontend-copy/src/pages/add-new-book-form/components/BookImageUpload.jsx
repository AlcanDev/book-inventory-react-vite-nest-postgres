import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookImageUpload = ({ currentImage, onImageChange, error }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // Validate file type
      if (!file?.type?.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }

      // Validate file size (max 5MB)
      if (file?.size > 5 * 1024 * 1024) {
        alert('El archivo no puede superar los 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(file, e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null, '');
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-foreground mb-6">
        Imagen del Libro
      </h3>
      
      <div className="space-y-4">
        {/* Image Preview Area */}
        <div className="aspect-[3/4] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <Icon name="ImagePlus" size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay imagen seleccionada
              </p>
            </div>
          )}
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            iconName="Upload"
            iconPosition="left"
            fullWidth
          >
            {currentImage ? 'Cambiar Imagen' : 'Subir Imagen'}
          </Button>

          {currentImage && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemoveImage}
              iconName="Trash2"
              iconPosition="left"
              fullWidth
              className="text-red-600 hover:text-red-700"
            >
              Eliminar Imagen
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Formatos admitidos: JPG, PNG, WEBP</p>
          <p>• Tamaño máximo: 5MB</p>
          <p>• Resolución recomendada: 400x600px</p>
        </div>
      </div>
    </div>
  );
};

export default BookImageUpload;