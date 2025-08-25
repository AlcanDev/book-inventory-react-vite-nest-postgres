import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessNotification = ({ isEdit, onClose }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4">
      <div className="flex items-start">
        <Icon name="CheckCircle" size={20} className="text-green-500 mr-3 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800">
            {isEdit ? '¡Libro actualizado correctamente!' : '¡Libro agregado correctamente!'}
          </h3>
          <p className="text-sm text-green-700 mt-1">
            {isEdit 
              ? 'Los cambios se han guardado exitosamente.'
              : 'El nuevo libro se ha agregado al inventario.'
            } Serás redirigido al inventario en unos segundos.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          iconName="X"
          className="text-green-600 hover:text-green-700"
        />
      </div>
    </div>
  );
};

export default SuccessNotification;